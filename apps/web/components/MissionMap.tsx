"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet";

export type MissionMapRecord = {
  id: string;
  category: string;
  urgency: string;
  district: string;
  city: string;
  addressLine: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  missions: MissionMapRecord[];
  selectedMissionId?: string | null;
  pickedLocation?: { latitude: number; longitude: number } | null;
  onSelectMission?: (requestId: string) => void;
  onPickLocation?: (latitude: number, longitude: number) => void;
  height?: number;
};

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];

const statusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "#16a34a";
    case "in_progress":
      return "#ea580c";
    case "assigned":
      return "#2563eb";
    case "matched":
      return "#0ea5e9";
    case "cancelled":
      return "#ef4444";
    default:
      return "#7c3aed";
  }
};

function MapClickCapture({ onPickLocation }: { onPickLocation?: (latitude: number, longitude: number) => void }) {
  useMapEvents({
    click(event) {
      onPickLocation?.(event.latlng.lat, event.latlng.lng);
    }
  });

  return null;
}

export default function MissionMap({
  missions,
  selectedMissionId,
  pickedLocation,
  onSelectMission,
  onPickLocation,
  height = 420
}: Props) {
  const visibleMissions = missions.filter((mission) => mission.latitude !== null && mission.longitude !== null);

  return (
    <div className="map-shell" style={{ height }}>
      <MapContainer center={SRI_LANKA_CENTER} zoom={7} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickCapture onPickLocation={onPickLocation} />

        {visibleMissions.map((mission) => {
          const selected = mission.id === selectedMissionId;
          return (
            <CircleMarker
              key={mission.id}
              center={[mission.latitude as number, mission.longitude as number]}
              radius={selected ? 11 : 8}
              pathOptions={{
                color: statusColor(mission.status),
                fillColor: statusColor(mission.status),
                fillOpacity: 0.75
              }}
              eventHandlers={{
                click: () => onSelectMission?.(mission.id)
              }}
            >
              <Tooltip direction="top">{mission.category} ({mission.status})</Tooltip>
              <Popup>
                <strong>{mission.category}</strong>
                <p>{mission.addressLine}</p>
                <p>
                  {mission.city}, {mission.district}
                </p>
                <p>Status: {mission.status === "in_progress" ? "ongoing" : mission.status}</p>
                <p>Urgency: {mission.urgency}</p>
              </Popup>
            </CircleMarker>
          );
        })}

        {pickedLocation ? (
          <CircleMarker
            center={[pickedLocation.latitude, pickedLocation.longitude]}
            radius={9}
            pathOptions={{
              color: "#0f766e",
              fillColor: "#14b8a6",
              fillOpacity: 0.8
            }}
          >
            <Tooltip direction="top">Selected mission point</Tooltip>
          </CircleMarker>
        ) : null}
      </MapContainer>
    </div>
  );
}
