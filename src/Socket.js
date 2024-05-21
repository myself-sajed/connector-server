
function handleSocket(io) {
    io.on("connection", (socket) => {
        console.log('User Connected', socket.id);

        socket.on('message:client', (message) => {
            console.log('User Message :', message)
            socket.emit("message:server", message)
        })

        socket.on("disconnect", async () => {
            console.log("socket disconnect", socket.id)
        })

    })
}

export default handleSocket