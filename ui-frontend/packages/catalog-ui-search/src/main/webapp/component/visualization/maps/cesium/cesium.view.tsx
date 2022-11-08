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
import Button from '@material-ui/core/Button'
import React from 'react'
import { useListenTo } from '../../../selection-checkbox/useBackbone.hook'
import { MapViewReact } from '../map.view'
import { OpenlayersMapViewReact } from '../openlayers/openlayers.view'

//You typically don't want to use this view directly.  Instead, use the combined-map component which will handle falling back to openlayers.

const $ = require('jquery')
const _ = require('underscore')
const featureDetection = require('../../../singletons/feature-detection.js')

const useSupportsCesium = () => {
  const [, setForceRender] = React.useState(Math.random())

  useListenTo(featureDetection, 'change:cesium', () => {
    setForceRender(Math.random())
  })

  return featureDetection.supportsFeature('cesium')
}

const useCountdown = ({
  start,
  length,
}: {
  start: boolean
  length: number
}) => {
  const [finished, setFinished] = React.useState(false)

  React.useEffect(() => {
    if (start && length) {
      const timeoutId = window.setTimeout(() => {
        setFinished(true)
      }, length)
      return () => {
        window.clearTimeout(timeoutId)
      }
    }
    return () => {}
  }, [start, length])
  return finished
}

export const CesiumMapViewReact = ({
  selectionInterface,
}: {
  selectionInterface: any
}) => {
  const supportsCesium = useSupportsCesium()
  const countdownFinished = useCountdown({
    start: !supportsCesium,
    length: 10000,
  })
  const [swap, setSwap] = React.useState(false)
  if (supportsCesium) {
    return (
      <MapViewReact
        loadMap={() => {
          const deferred = new $.Deferred()
          require(['./map.cesium'], (CesiumMap) => {
            deferred.resolve(CesiumMap)
          })
          return deferred
        }}
        createMap={() => {}}
        selectionInterface={selectionInterface}
      />
    )
  }

  if (countdownFinished || swap) {
    return <OpenlayersMapViewReact selectionInterface={selectionInterface} />
  }

  return (
    <>
      <div className="not-supported p-4 flex flex-col items-center space-y-4">
        <h3 className=" text-center">
          The 3D Map is not supported by your browser.
        </h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSwap(true)
          }}
        >
          2D Map
        </Button>
        <h3 className=" text-center">
          2D Map will automatically load after 10 seconds.
        </h3>
      </div>
    </>
  )
}

// try {
//   MapView.prototype.createMap.apply(this, arguments)
// } catch (err) {
//   console.error(err)
//   this.$el.addClass('not-supported')
//   setTimeout(() => {
//     this.switchTo2DMap()
//   }, 10000)
//   this.endLoading()
// }

// featureDetection.addFailure('cesium')
