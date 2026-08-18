const API_URL = "http://localhost:8080/api";

export const getAllRooms = async () => {
    const response = await fetch(`${API_URL}/rooms`);

    if (!response.ok) {
        throw new Error("Failed to fetch rooms");
    }

    return response.json();
};

export const getRoomsByOwner = async (email) => {
    const response = await fetch(`${API_URL}/rooms/owner/${email}`);

    if (!response.ok) {
        throw new Error("failed to fetch owner's rooms");
    }

    return response.json();
}

export const updateRoomAvailability = async (roomId, available) => {
    const response = await fetch(`${API_URL}/rooms/${roomId}/availability`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ available })
    });

    if (!response.ok) {
        throw new Error("Failed to update room availability");
    }

    return response.json();
}

export const getBookingsByOwner = async (email) => {
    const response = await fetch(`${API_URL}/bookings/owner/${email}`);

    if (!response.ok) {
        throw new Error("Failed to fetch owner's bookings");
    }

    return response.json();
};

export const checkRoomAvailabity = async (roomId, checkIn, checkOut) => {
    const response = await fetch (
        `${API_URL}/bookings/check-availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
    if (!response.ok) {
    throw new Error("Failed to check availability");
    }
    return response.json();
};

//Edit option api
export const getRoomById = async (roomId) => {
   const response = await fetch(`${API_URL}/rooms/${roomId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch room");
        
    }
    return response.json();
}

export const updateRoom = async (roomId, roomData, imageFiles) => {
    const formData = new FormData();

    formData.append(
        'room',
        new Blob([JSON.stringify(roomData)], {type: 'application/json'})
    );

    if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
            if (file) formData.append('images', file);
        });
    }

    const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to update room");
    }

    return response.json();
};