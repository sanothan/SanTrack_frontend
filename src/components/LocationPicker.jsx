import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

/**
 * LocationPicker
 * An interactive map (Leaflet + OpenStreetMap, no API key needed) that lets
 * the user click to place a marker. Fires onLocationSelect({ lat, lng }).
 *
 * Props:
 *   onLocationSelect  (lat, lng) => void   – called whenever the marker moves
 *   initialLocation   { lat, lng }         – optional pre-placed marker
 */
const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        // ── Load Leaflet CSS once ──────────────────────────────────────────
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // ── Load Leaflet JS once, then init map ───────────────────────────
        const initMap = () => {
            const L = window.L;
            if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

            const defaultCenter = initialLocation
                ? [initialLocation.lat, initialLocation.lng]
                : [7.8731, 80.7718]; // Sri Lanka center
            const defaultZoom = initialLocation ? 12 : 7;

            const map = L.map(mapContainerRef.current).setView(defaultCenter, defaultZoom);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Fix default icon paths broken by bundlers
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Pre-place marker if initialLocation provided
            if (initialLocation) {
                const marker = L.marker([initialLocation.lat, initialLocation.lng], { draggable: true }).addTo(map);
                markerRef.current = marker;
                marker.on('dragend', () => {
                    const { lat, lng } = marker.getLatLng();
                    onLocationSelect({ lat: +lat.toFixed(6), lng: +lng.toFixed(6) });
                });
            }

            // Click to place/move marker
            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                const rounded = { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };

                if (markerRef.current) {
                    markerRef.current.setLatLng([rounded.lat, rounded.lng]);
                } else {
                    const marker = L.marker([rounded.lat, rounded.lng], { draggable: true }).addTo(map);
                    markerRef.current = marker;
                    marker.on('dragend', () => {
                        const { lat: dLat, lng: dLng } = marker.getLatLng();
                        onLocationSelect({ lat: +dLat.toFixed(6), lng: +dLng.toFixed(6) });
                    });
                }

                onLocationSelect(rounded);
            });
        };

        if (window.L) {
            initMap();
        } else if (!document.getElementById('leaflet-js')) {
            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = initMap;
            document.body.appendChild(script);
        } else {
            // Script tag exists but may still be loading — poll
            const poll = setInterval(() => {
                if (window.L) { clearInterval(poll); initMap(); }
            }, 100);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-1">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3 mr-1 text-primary" />
                Click on the map to pin the village location
            </div>
            <div
                ref={mapContainerRef}
                style={{ height: '280px', width: '100%', borderRadius: '8px', zIndex: 0 }}
                className="border overflow-hidden"
            />
        </div>
    );
};

export default LocationPicker;
