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
import * as React from 'react';
import { Attribute } from './filterHelper';
import { FilterClass } from '../../component/filter-builder/filter.structure';
import { ValidationResult } from '../location/validators';
type Props = {
    filter: FilterClass;
    setFilter: (filter: FilterClass) => void;
    errorListener?: (validationResults: {
        [key: string]: ValidationResult | undefined;
    }) => void;
};
export declare const FilterContext: React.Context<{
    limitedAttributeList: Attribute[] | undefined;
}>;
declare const _default: ({ filter, setFilter, errorListener }: Props) => JSX.Element;
export default _default;
