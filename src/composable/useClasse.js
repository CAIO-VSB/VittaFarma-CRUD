    import { ref as vueref, onMounted, onUnmounted, reactive } from "vue"
    import { database } from "@/DB/fireBase"
    import { ref as dbref, onValue, off } from "firebase/database"

    export  function useClasse() {
        const classes = vueref([])
        const cache = reactive({
            data: null,
            timestamp: null,
            expirationTime: 5 * 60 * 1000
        })

        const buscarClasse = () => {
            const currentTime = Date.now()
            if (cache.data && cache.timestamp && (currentTime - cache.timestamp < cache.expirationTime)) {
                classes.value = cache.data
                return
            }

            const classesRef = dbref(database, "ClasseName")

            onValue(classesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const classesData = snapshot.val()
                    const arrayClasse = []

                    for (let classe in classesData) {
                        arrayClasse.push({Name: classesData[classe].Nome})
                    }

                    cache.data = arrayClasse
                    cache.timestamp = Date.now()
                    classes.value = arrayClasse
                }
            }), {onlyOne: true}
        }

        onMounted(() => {
            buscarClasse()
        })

        onUnmounted(()=> {  
            const classesRef = dbref(database, "ClasseName")
            off(classesRef)
        })

        const recarregarClasse = () => {
            cache.timestamp = null
            buscarClasse()
        }

        return {
            recarregarClasse,
            classes,
            buscarClasse
        }
    }