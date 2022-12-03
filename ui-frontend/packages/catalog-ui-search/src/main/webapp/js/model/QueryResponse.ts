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
import $ from 'jquery';
import Backbone from 'backbone';
import metacardDefinitions from '../../component/singletons/metacard-definitions';
import properties from '../properties';
import 'backbone-associations';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'rpc-... Remove this comment to see the full error message
import * as rpcwebsockets from 'rpc-websockets';
let rpc: any = null;
if ((properties as any).webSocketsEnabled && window.WebSocket) {
    const Client = rpcwebsockets.Client;
    const protocol = { 'http:': 'ws:', 'https:': 'wss:' };
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const url = `${protocol[location.protocol]}//${location.hostname}:${location.port}${location.pathname}ws`;
    rpc = new Client(url);
}
export default Backbone.AssociatedModel.extend({
    defaults() {
        return {
            lazyResults: undefined,
        };
    },
    url: './internal/cql',
    useAjaxSync: true,
    initialize() {
        this.listenTo(this, 'error', this.handleError);
    },
    sync(method: any, model: any, options: any) {
        if (rpc !== null) {
            let handled = false;
            const promise = rpc
                .call('query', [options.data], options.timeout)
                // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
                .then((res: any) => {
                if (!handled) {
                    handled = true;
                    options.success(res);
                    return [res, 'success'];
                }
            })
                // @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
                .catch((res: any) => {
                if (!handled) {
                    handled = true;
                    res.options = options;
                    switch (res.code) {
                        case 400:
                        case 404:
                        case 500:
                            options.error({
                                responseJSON: res,
                            });
                            break;
                        case -32000:
                            if (rpc !== null) {
                                rpc.close();
                                rpc = null;
                            }
                            options.error({
                                responseJSON: {
                                    message: 'User not logged in.',
                                },
                            });
                            break;
                        default:
                            // notify user and fallback to http
                            if (rpc !== null) {
                                rpc.close();
                                rpc = null;
                            }
                            options.error({
                                responseJSON: {
                                    message: 'Search failed due to unknown reasons, please try again.',
                                },
                            });
                    }
                    return [res, 'error'];
                }
            });
            model.trigger('request', model, null, options);
            return {
                abort() {
                    if (!handled) {
                        handled = true;
                        options.error({
                            responseJSON: {
                                message: 'Stopped',
                            },
                        });
                    }
                },
                promise() {
                    const d = $.Deferred();
                    promise
                        .then((value: any) => {
                        d.resolve(value);
                    })
                        .catch((err: any) => {
                        d.reject(err);
                    });
                    return d;
                },
            };
        }
        else {
            return Backbone.AssociatedModel.prototype.sync.call(this, method, model, options);
        }
    },
    // @ts-expect-error ts-migrate(6133) FIXME: 'resultModel' is declared but its value is never r... Remove this comment to see the full error message
    handleError(resultModel: any, response: any, sent: any) {
        const dataJSON = JSON.parse(sent.data);
        this.get('lazyResults').updateStatusWithError({
            sources: dataJSON.srcs,
            message: response.responseJSON
                ? response.responseJSON.message
                : response.statusText,
        });
    },
    // @ts-expect-error ts-migrate(6133) FIXME: 'resultModel' is declared but its value is never r... Remove this comment to see the full error message
    handleSync(resultModel: any, response: any, sent: any) {
        if (sent) {
            // @ts-expect-error ts-migrate(6133) FIXME: 'dataJSON' is declared but its value is never read... Remove this comment to see the full error message
            const dataJSON = JSON.parse(sent.data);
        }
    },
    // @ts-expect-error ts-migrate(6133) FIXME: 'options' is declared but its value is never read.
    parse(resp: any, options: any) {
        metacardDefinitions.addMetacardDefinitions(resp.types);
        this.get('lazyResults').addTypes(resp.types);
        this.get('lazyResults').updateStatus(resp.statusBySource);
        this.get('lazyResults').updateDidYouMeanFields(resp.didYouMeanFields);
        this.get('lazyResults').updateShowingResultsForFields(resp.showingResultsForFields);
        this.get('lazyResults').add({
            results: resp.results,
            highlights: resp.highlights || [], // ensure highlights is not null
        });
        return {};
    },
});
