export function mockedLoginResponse() {
    return {
        "success": true,
        "session": {
            "id": "1234"
        },
        "user": {
            "id": "1",
            "email": "user@example.com"
        }
    }
}