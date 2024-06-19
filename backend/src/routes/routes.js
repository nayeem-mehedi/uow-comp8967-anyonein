const routes = (app) => {
    app.route('/api/users')
    .get((req, res) =>
        res.send('Get request successful')
    )


    .post((req, res) => 
        res.send('Post request successful')
    )


    app.route('/api/user/:userID')
    .put((req, res) => 
        res.send('Put request successful')
    )

    .delete((req, res) => 
        res.send('Delete request successful')
    )
}

export default routes;