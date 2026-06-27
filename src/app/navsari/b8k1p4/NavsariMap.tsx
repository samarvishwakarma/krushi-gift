"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type Kind = "home" | "place" | "food" | "heart";

export type Landmark = {
    id?: string; // present only for user-added (DB) pins
    name: string;
    lat: number;
    lon: number;
    emoji: string;
    kind: Kind;
    note: string;
    photo?: string;
};

const PIN_COLOR: Record<Kind, string> = {
    home: "#B9473A",
    place: "#8B4513",
    food: "#C07048",
    heart: "#D6486A",
};

/* ---- Map palette (beige land + red roads, matching the printed poster) ---- */
const LAND = "#F4E9D2";
const WATER = "#C7D6DC";
const ROAD = "#BC8B75"; // same red as the page text/headings
const RAIL = "#7c6b54"; // warm brown dashed rail track

const OPENFREEMAP = "https://tiles.openfreemap.org/planet";
const SRC = "ofm";

const width = (stops: [number, number][]) =>
    ["interpolate", ["linear"], ["zoom"], ...stops.flat()] as unknown as never;

const roadFilter = (classes: string[]) =>
    ["all", ["==", ["geometry-type"], "LineString"], ["match", ["get", "class"], classes, true, false]] as unknown as never;

function buildStyle(): StyleSpecification {
    return {
        version: 8,
        sources: {
            [SRC]: { type: "vector", url: OPENFREEMAP, maxzoom: 14 },
        },
        layers: [
            { id: "bg", type: "background", paint: { "background-color": LAND } },
            {
                id: "water",
                source: SRC,
                "source-layer": "water",
                type: "fill",
                paint: { "fill-color": WATER },
            },
            {
                id: "waterway",
                source: SRC,
                "source-layer": "waterway",
                type: "line",
                paint: { "line-color": WATER, "line-width": width([[8, 0.6], [14, 2], [18, 5]]) },
                layout: { "line-cap": "round", "line-join": "round" },
            },
            // Roads — red, thinner & fainter for smaller classes.
            {
                id: "road-minor-low",
                source: SRC,
                "source-layer": "transportation",
                type: "line",
                filter: roadFilter(["residential", "living_street", "unclassified", "road", "service", "street"]),
                paint: { "line-color": ROAD, "line-opacity": 0.45, "line-width": width([[12, 0.5], [15, 1.3], [18, 3]]) },
                layout: { "line-cap": "round", "line-join": "round" },
            },
            {
                id: "road-minor-mid",
                source: SRC,
                "source-layer": "transportation",
                type: "line",
                filter: roadFilter(["tertiary", "tertiary_link", "minor"]),
                paint: { "line-color": ROAD, "line-opacity": 0.7, "line-width": width([[11, 0.7], [14, 1.7], [18, 3.6]]) },
                layout: { "line-cap": "round", "line-join": "round" },
            },
            {
                id: "road-minor-high",
                source: SRC,
                "source-layer": "transportation",
                type: "line",
                filter: roadFilter(["primary", "primary_link", "secondary", "secondary_link", "trunk", "trunk_link", "motorway_link"]),
                paint: { "line-color": ROAD, "line-opacity": 0.9, "line-width": width([[9, 0.8], [13, 2], [18, 5]]) },
                layout: { "line-cap": "round", "line-join": "round" },
            },
            {
                id: "road-major",
                source: SRC,
                "source-layer": "transportation",
                type: "line",
                filter: roadFilter(["motorway"]),
                paint: { "line-color": ROAD, "line-width": width([[7, 1], [12, 2.4], [16, 4.5], [18, 7]]) },
                layout: { "line-cap": "round", "line-join": "round" },
            },
            // Railway — dashed line on top so the track is clearly visible.
            {
                id: "rail",
                source: SRC,
                "source-layer": "transportation",
                type: "line",
                filter: roadFilter(["rail", "transit"]),
                paint: {
                    "line-color": RAIL,
                    "line-opacity": 0.85,
                    "line-width": width([[8, 0.8], [12, 1.4], [16, 2.4], [18, 3.4]]),
                    "line-dasharray": [2, 2.2],
                },
                layout: { "line-cap": "butt", "line-join": "round" },
            },
        ],
    } as StyleSpecification;
}

function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );
}

type Props = {
    pins: Landmark[];
    editing?: boolean;
    onAddAt?: (lat: number, lon: number) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
};

export default function NavsariMap({ pins, editing = false, onAddAt, onDelete, onEdit }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);

    // Latest values in refs so the once-only init effect reads them fresh.
    const pinsRef = useRef(pins);
    const editingRef = useRef(editing);
    const onAddRef = useRef(onAddAt);
    const onDelRef = useRef(onDelete);
    const onEditRef = useRef(onEdit);
    pinsRef.current = pins;
    editingRef.current = editing;
    onAddRef.current = onAddAt;
    onDelRef.current = onDelete;
    onEditRef.current = onEdit;

    // Init the map once.
    useEffect(() => {
        const container = containerRef.current;
        if (!container || mapRef.current) return;

        const map = new maplibregl.Map({
            container,
            style: buildStyle(),
            attributionControl: { compact: true },
            dragRotate: false,
            pitchWithRotate: false,
            maxZoom: 18,
        });
        mapRef.current = map;

        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
        map.touchZoomRotate.disableRotation();

        const bounds = new maplibregl.LngLatBounds();
        pinsRef.current.forEach((l) => bounds.extend([l.lon, l.lat]));
        const recenter = (animate = true) =>
            map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: animate ? 700 : 0 });
        if (!bounds.isEmpty()) recenter(false);

        // Recenter ("back to our world") control.
        const recenterEl = document.createElement("div");
        recenterEl.className = "maplibregl-ctrl maplibregl-ctrl-group";
        const recenterBtn = document.createElement("button");
        recenterBtn.type = "button";
        recenterBtn.title = "Back to our world";
        recenterBtn.setAttribute("aria-label", "Recenter map");
        recenterBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a6f53" stroke-width="2" stroke-linecap="round" style="display:block;margin:auto"><circle cx="12" cy="12" r="6"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>`;
        recenterBtn.onclick = () => recenter(true);
        recenterEl.appendChild(recenterBtn);
        map.addControl(
            { onAdd: () => recenterEl, onRemove: () => recenterEl.remove() } as maplibregl.IControl,
            "top-left",
        );

        // Click empty map (in edit mode) → add a pin there.
        map.on("click", (e) => {
            if (editingRef.current) onAddRef.current?.(e.lngLat.lat, e.lngLat.lng);
        });

        // Delegated edit/delete-button clicks inside popups.
        const onContainerClick = (ev: MouseEvent) => {
            const target = ev.target as HTMLElement;
            const delId = target?.closest?.("[data-del]")?.getAttribute("data-del");
            if (delId) {
                onDelRef.current?.(delId);
                return;
            }
            const editId = target?.closest?.("[data-edit]")?.getAttribute("data-edit");
            if (editId) onEditRef.current?.(editId);
        };
        container.addEventListener("click", onContainerClick);

        return () => {
            container.removeEventListener("click", onContainerClick);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Reflect edit mode on the cursor.
    useEffect(() => {
        const map = mapRef.current;
        if (map) map.getCanvas().style.cursor = editing ? "crosshair" : "";
    }, [editing]);

    // Rebuild markers whenever the pins (or edit mode) change.
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        for (const l of pins) {
            const isHeart = l.kind === "heart";
            const size = isHeart ? 15 : l.kind === "home" ? 42 : 32;
            const fs = isHeart ? 0 : l.kind === "home" ? 22 : 16;

            const el = document.createElement("div");
            el.style.cssText = `display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:${PIN_COLOR[l.kind]};border:2px solid #fff;box-shadow:0 3px 6px rgba(0,0,0,.3);font-size:${fs}px;cursor:pointer`;
            el.textContent = isHeart ? "" : l.emoji;

            const photo = l.photo
                ? `<img src="${escapeHtml(l.photo)}" alt="" onerror="this.remove()" style="width:100%;height:96px;object-fit:cover;border-radius:5px;border:1px solid #eadcc0;margin-bottom:6px"/>`
                : "";
            const editControls =
                editing && l.id
                    ? `<div style="display:flex;gap:6px;margin-top:8px">
                            <button data-edit="${escapeHtml(l.id)}" style="flex:1;border:1px solid #e0cba2;background:#fffaf0;color:#8a6f53;border-radius:8px;padding:4px 0;cursor:pointer;font:inherit">edit ✎</button>
                            <button data-del="${escapeHtml(l.id)}" style="flex:1;border:1px solid #e7b3bd;background:#fff0f2;color:#b23b53;border-radius:8px;padding:4px 0;cursor:pointer;font:inherit">remove 🗑</button>
                        </div>`
                    : "";
            const html = `<div style="width:170px;text-align:center">
                    ${photo}
                    <div style="font-family:var(--font-caveat),cursive;font-size:21px;line-height:1.1;color:#b23b53">${escapeHtml(l.name)}</div>
                    <div style="font-size:14px;color:#7a5a38;margin-top:2px">${escapeHtml(l.note)}</div>
                    ${editControls}
                </div>`;

            const popup = new maplibregl.Popup({
                offset: size / 2 + 6,
                closeButton: true,
                maxWidth: "200px",
            }).setHTML(html);

            const marker = new maplibregl.Marker({ element: el, anchor: "center" })
                .setLngLat([l.lon, l.lat])
                .setPopup(popup)
                .addTo(map);
            markersRef.current.push(marker);
        }
    }, [pins, editing]);

    return <div ref={containerRef} className="navsari-map h-full w-full" />;
}
