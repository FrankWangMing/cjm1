import ReactDOM from 'react-dom';

export function mapPoint(
  center: [number, number],
  element: JSX.Element,
  clickEvent: Function,
  map?: mapboxgl.Map
): mapboxgl.Marker {
  let markerNode = document.createElement('div');
  ReactDOM.render(element, markerNode);
  markerNode.addEventListener('click', event => {
    clickEvent();
  });
  return new mapboxgl.Marker({
    element: markerNode,
    anchor: 'bottom'
  }).setLngLat(center);
}
