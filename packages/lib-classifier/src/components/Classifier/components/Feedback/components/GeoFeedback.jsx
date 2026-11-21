import { useEffect, useRef } from 'react'
import { Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import styled from 'styled-components'

import { useStores } from '@hooks'
import createTileLayer from '../../SubjectViewer/components/GeoMapViewer/helpers/createTileLayer'
import getGeoFeedbackFeatures from './helpers/getGeoFeedbackFeatures'

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
`

function storeMapper (classifierStore) {
  const {
    classifications: { currentAnnotations: annotations },
    feedback: { applicableRules },
    workflows: { active: workflow }
  } = classifierStore

  return {
    annotations,
    applicableRules,
    tasks: workflow?.tasks ?? {},
    tileLayers: workflow?.configuration?.subject_viewer_config?.tile_layers ?? []
  }
}

export default function GeoFeedback () {
  const { annotations = [], applicableRules = [], tasks, tileLayers } = useStores(storeMapper)
  const mapElement = useRef(null)

  useEffect(function createFeedbackMap () {
    if (!mapElement.current) return undefined

    const descriptors = tileLayers.length ? tileLayers : [{ type: 'osm' }]
    const source = new VectorSource({
      features: getGeoFeedbackFeatures(annotations, applicableRules, tasks)
    })
    const map = new Map({
      target: mapElement.current,
      controls: [],
      interactions: [],
      layers: [
        ...descriptors.map(descriptor => createTileLayer(descriptor)),
        new VectorLayer({ source })
      ],
      view: new View({ center: [0, 0], zoom: 2 })
    })
    const extent = source.getExtent()
    if (extent.every(Number.isFinite)) {
      map.getView().fit(extent, { padding: [40, 40, 40, 40], maxZoom: 17 })
    }

    return function destroyFeedbackMap () {
      map.setTarget(undefined)
    }
  }, [annotations, applicableRules, tasks, tileLayers])

  return (
    <MapContainer
      data-testid='geo-feedback-map'
      ref={mapElement}
    />
  )
}
