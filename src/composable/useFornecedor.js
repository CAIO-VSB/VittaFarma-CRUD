    import { ref as vueref, onMounted, onUnmounted, reactive } from "vue"
    import { database } from "@/DB/fireBase"
    import { ref as dbref, onValue, off } from "firebase/database"

    export function useFornecedor() {
        const fornecedores = vueref([])
        const cache = reactive({
            data: null,
            timestamp: null,
            expirationTime: 5 * 60 * 1000
        })

        const buscarFornecedor = () => {
            const currentTime = Date.now()

            if (cache.data && cache.timestamp && (currentTime - cache.timestamp < cache.expirationTime)) {
                fornecedores.value = cache.data
                return
            }

            const fornecedorRef = dbref(database, "FornecedorName")

            onValue(fornecedorRef, (snapshot) => {
                if (snapshot.exists()) {
                    const fornecedorData = snapshot.val()
                    const arrayFornecedor = []

                    for (let fornecedor in fornecedorData) {
                        arrayFornecedor.push({Name: fornecedorData[fornecedor].Nome})
                    }

                    cache.data = arrayFornecedor
                    cache.timestamp = Date.now()

                    fornecedores.value = arrayFornecedor
                }
            }), {onlyOne: true}
        }

        onMounted(() => {
            buscarFornecedor()
        })

        onUnmounted(() => {
            const fornecedorRef = dbref(database, "FornecedorName")
            off(fornecedorRef)
        })

        const recarregarFornecedor = () => {
            cache.timestamp = null
            buscarFornecedor()
        }

        return {
            recarregarFornecedor,
            fornecedores,
            buscarFornecedor
        }
    }
