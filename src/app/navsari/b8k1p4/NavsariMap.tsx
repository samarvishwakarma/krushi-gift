"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type Kind = "home" | "place" | "food" | "heart";

export type Landmark = {
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
const ROAD = "#d17e89"; // same red as the page text/headings

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
        ],
    } as StyleSpecification;
}

function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );
}

export default function NavsariMap({ landmarks }: { landmarks: Landmark[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

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
        landmarks.forEach((l) => bounds.extend([l.lon, l.lat]));
        const recenter = (animate = true) =>
            map.fitBounds(bounds, {
                padding: 60,
                maxZoom: 15,
                duration: animate ? 700 : 0,
            });
        recenter(false);

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
            {
                onAdd: () => recenterEl,
                onRemove: () => recenterEl.remove(),
            } as maplibregl.IControl,
            "top-left",
        );

        for (const l of landmarks) {
            const isHeart = l.kind === "heart";
            const size = isHeart ? 15 : l.kind === "home" ? 42 : 32;
            const fs = isHeart ? 0 : l.kind === "home" ? 22 : 16;

            const el = document.createElement("div");
            el.style.cssText = `display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:${PIN_COLOR[l.kind]};border:2px solid #fff;box-shadow:0 3px 6px rgba(0,0,0,.3);font-size:${fs}px;cursor:pointer`;
            el.textContent = isHeart ? "" : l.emoji;

            const photo = l.photo
                ? `<img src="${escapeHtml(l.photo)}" alt="" onerror="this.remove()" style="width:100%;height:96px;object-fit:cover;border-radius:5px;border:1px solid #eadcc0;margin-bottom:6px"/>`
                : "";
            const html = `<div style="width:170px;text-align:center">
                    ${photo}
                    <div style="font-family:var(--font-caveat),cursive;font-size:21px;line-height:1.1;color:#b23b53">${escapeHtml(l.name)}</div>
                    <div style="font-size:14px;color:#7a5a38;margin-top:2px">${escapeHtml(l.note)}</div>
                </div>`;

            const popup = new maplibregl.Popup({
                offset: size / 2 + 6,
                closeButton: true,
                maxWidth: "200px",
            }).setHTML(html);

            new maplibregl.Marker({ element: el, anchor: "center" })
                .setLngLat([l.lon, l.lat])
                .setPopup(popup)
                .addTo(map);
        }

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [landmarks]);

    return <div ref={containerRef} className="navsari-map h-full w-full" />;
}
