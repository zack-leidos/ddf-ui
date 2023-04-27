/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import Backbone from 'backbone';
import $ from 'jquery';
import fetch from '../../react-component/utils/fetch';
import '../jquery.whenAll';
function fileMatches(file, model) {
    return file === model.get('file');
}
function checkValidation(model) {
    if (model.get('id')) {
        model.set('validating', true);
        //wait for solr
        setTimeout(function () {
            ;
            $.whenAll
                .apply(this, [
                fetch('./internal/metacard/' + model.get('id') + '/attribute/validation')
                    .then(function (response) { return response.json(); })
                    .then(function (response) {
                    model.set({
                        issues: model.get('issues') || response.length > 0
                    });
                }),
                fetch('./internal/metacard/' + model.get('id') + '/validation')
                    .then(function (response) { return response.json(); })
                    .then(function (response) {
                    model.set({
                        issues: model.get('issues') || response.length > 0
                    });
                }),
            ])
                .always(function () {
                model.set({
                    validating: false
                });
            });
        }, 2000);
    }
}
export default Backbone.Model.extend({
    options: undefined,
    defaults: function () {
        return {
            id: undefined,
            children: undefined,
            result: undefined,
            file: undefined,
            percentage: 0,
            sending: false,
            success: false,
            error: false,
            message: '',
            validating: false,
            issues: false
        };
    },
    bindCallbacks: function () {
        this.handleUploadProgress = this.handleUploadProgress.bind(this);
        this.handleSending = this.handleSending.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleQueueComplete = this.handleQueueComplete.bind(this);
    },
    // @ts-expect-error ts-migrate(6133) FIXME: 'attributes' is declared but its value is never re... Remove this comment to see the full error message
    initialize: function (attributes, options) {
        this.bindCallbacks();
        this.options = options;
        this.setupDropzoneListeners();
    },
    setupDropzoneListeners: function () {
        if (this.options.dropzone) {
            this.options.dropzone.on('sending', this.handleSending);
            this.options.dropzone.on('uploadprogress', this.handleUploadProgress);
            this.options.dropzone.on('error', this.handleError);
            this.options.dropzone.on('success', this.handleSuccess);
            this.options.dropzone.on('complete', this.handleComplete);
            this.options.dropzone.on('queuecomplete', this.handleQueueComplete);
        }
    },
    handleSending: function (file) {
        if (fileMatches(file, this)) {
            this.set({
                sending: true
            });
        }
    },
    handleUploadProgress: function (file, percentage) {
        if (fileMatches(file, this)) {
            this.set('percentage', percentage);
        }
    },
    handleError: function (file) {
        if (fileMatches(file, this)) {
            var message = file.name + ' could not be uploaded successfully.';
            this.set({
                error: true,
                message: message
            });
        }
    },
    hasChildren: function () {
        return this.get('children') && this.get('children').length > 1;
    },
    handleQueueComplete: function () {
        var _this = this;
        // https://github.com/enyo/dropzone/blob/v4.3.0/dist/dropzone.js#L56
        // if we remove callbacks too early this loop will fail, look to see if updating to latest fixes this
        setTimeout(function () {
            _this.unlistenToDropzone();
        }, 0);
    },
    unlistenToDropzone: function () {
        this.options.dropzone.off('sending', this.handleSending);
        this.options.dropzone.off('queuecomplete', this.handleQueueComplete);
        this.options.dropzone.off('uploadprogress', this.handleUploadProgress);
        this.options.dropzone.off('success', this.handleSuccess);
        this.options.dropzone.off('error', this.handleError);
        this.options.dropzone.off('complete', this.handleComplete);
    },
    handleSuccess: function (file) {
        if (fileMatches(file, this)) {
            var message = "".concat(file.name, " uploaded successfully.");
            var addedIdsHeader = file.xhr.getResponseHeader('added-ids');
            var children = addedIdsHeader ? addedIdsHeader.split(',') : undefined;
            if (children && children.length > 1) {
                message += " ".concat(children.length, " items found.");
            }
            this.set({
                id: file.xhr.getResponseHeader('id'),
                children: children,
                success: true,
                message: message
            });
            checkValidation(this);
        }
    },
    handleComplete: function (file) {
        if (fileMatches(file, this) && file.status === 'canceled') {
            this.collection.remove(this);
        }
    },
    checkValidation: function () {
        checkValidation(this);
    },
    cancel: function () {
        if (this.options.dropzone) {
            this.options.dropzone.removeFile(this.get('file'));
            if (this.collection) {
                this.collection.remove(this);
            }
        }
    }
});
//# sourceMappingURL=Upload.js.map