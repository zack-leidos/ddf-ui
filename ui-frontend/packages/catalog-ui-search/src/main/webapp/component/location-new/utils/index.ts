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
// @ts-expect-error ts-migrate(2614) FIXME: Module '"./wkt-utils"' has no exported member 'val... Remove this comment to see the full error message
import { validateWkt, roundWktCoords } from './wkt-utils';

// @ts-expect-error ts-migrate(2614) FIXME: Module '"./dd-utils"' has no exported member 'ddTo... Remove this comment to see the full error message
import { ddToWkt, validateDd, validateDdPoint } from './dd-utils';

import {
  dmsToWkt,
  validateDms,
  validateDmsPoint,
  dmsCoordinateToDD,
  parseDmsCoordinate,
  ddToDmsCoordinateLat,
  ddToDmsCoordinateLon,
  getSecondsPrecision,
  Direction,
} from './dms-utils';

// @ts-expect-error ts-migrate(2614) FIXME: Module '"./usng-utils"' has no exported member 'us... Remove this comment to see the full error message
import { usngToWkt, validateUsng, validateUsngGrid } from './usng-utils';
import errorMessages from './errors';

export default {
  validateWkt,
  roundWktCoords,
  validateDd,
  validateDdPoint,
  validateDms,
  validateDmsPoint,
  validateUsng,
  validateUsngGrid,
  ddToWkt,
  ddToDmsCoordinateLat,
  ddToDmsCoordinateLon,
  parseDmsCoordinate,
  dmsCoordinateToDD,
  dmsToWkt,
  usngToWkt,
  errorMessages,
  getSecondsPrecision,
  Direction,
};
