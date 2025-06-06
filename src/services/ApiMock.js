export function mockedLoginResponse(email = 'user@example.com', name = 'Usuário') {
    return {
        "success": true,
        "session": {
            "id": "1234"
        },
        "user": {
            "id": "1",
            "email": email,
            "name": name
        }
    }
}