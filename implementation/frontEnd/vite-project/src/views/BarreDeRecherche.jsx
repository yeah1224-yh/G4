import React from "react";

export default function BarreDeRecherche({ search, setSearch }) {
    return (
        <div style={{ padding: "10px" }}>
            <input
                type="text"
                placeholder="Rechercher un cours..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: "5px", width: "300px" }}
            />
        </div>
    );
}

