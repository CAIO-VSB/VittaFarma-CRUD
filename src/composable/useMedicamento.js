    import { ref as vueref, onMounted, onUnmounted, reactive } from "vue"
    import { database } from "@/DB/fireBase"
    import { ref as dbref, onValue, off } from "firebase/database"

    export function useMedicamentos() {

        //Array reativo que recebe todos os medicamentos
        const medicamentos = vueref([])
        //Cache para evitar requisições sem necessidade
        const cache = reactive({
            data: null,
            timestamp: null,
            expirationTime: 5 * 60 * 1000
        })

        //Função para buscar os medicamentos no DB
        const buscarMedicamentos = () => {
            try {
                const currentTime = Date.now()
                if (cache.data && cache.timestamp && (currentTime - cache.timestamp < cache.expirationTime)) {
                    medicamentos.value = cache.data
                    return
                }

                const medicamentosRef = dbref(database, "MedicamentosName")

                onValue(medicamentosRef, (snapshot) => {
                    if (snapshot.exists()) {
                       const medicamentosData = snapshot.val()
                       const arrayData = []

                       for (let medicamentos in medicamentosData) {
                        arrayData.push({Name: medicamentosData[medicamentos].Nome})
                       }

                       cache.data = arrayData
                       cache.timestamp = Date.now()

                       medicamentos.value = arrayData

                    } else {
                        medicamentos.value = [] 
                    }
                
                }), {onlyOne: true} // Faz a consulta somente uma vez

            }catch(error) {
                console.log("Deu erro no servidor:" + error)
            }
        }

        //Chama a função toda vez que o componente é montado
        onMounted(() => {
            buscarMedicamentos()
        })

        
        //Desmonta a função e para o ouvinte toda vez que o usuário sai da componente
        onUnmounted(() => {
            const medicamentosRef = dbref(database, "MedicamentosName")
            off(medicamentosRef)
        })

        //Força uma nova requisição ao DB quando o tempo de cache exceder
        const recarregarMedicamentos = () => {
            cache.timestamp = null
            buscarMedicamentos()
        }

        //Retorna as funções e variaveis a serem usadas 
        return {
            medicamentos,
            buscarMedicamentos,
            recarregarMedicamentos
        }

    }