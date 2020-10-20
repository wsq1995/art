import vue from "vue"
import Router from "vue-router"

vue.use(Router)
import helloWorld from "components/HelloWorld"

let routes = [
    {
        path: 'helloWorld',
        component: helloWorld
    }
]

const routers = new Router({
    routes: routes
})

export default routers
