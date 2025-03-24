    import { database } from "@/DB/fireBase";
    import { ref, get, off } from "firebase/database";
    import { onMounted, onUnmounted, ref as vueref } from "vue"
    import { getAuth, onAuthStateChanged } from "firebase/auth";

    export function useUsers() {
        
        const valores = vueref([]) // Variavel reativa para os valores filtrados

        const loading = vueref(true) // Variavel reativa para o loading

        const auth = getAuth()

        const  buscarDadosUsers = async (userUID) => {
            loading.value = true // Inico do loading de carregamento
            try {
                const UserRef = ref(database, `Users/${userUID}`) // Referencia ao nó no DB
                const snapshot = await get(UserRef) // Caputra do dados no momento da consulta
        
                if (snapshot.exists()) { // Verifico se existe algum dado
                    valores.value = snapshot.val() // Armazeno esses dados em uma variavel
                }
            }catch(error) { // Propriedade para lidar somente com erros das promisses
                console.log("error: " + error)
            } finally { // Propriedada usada para encerrar o loading independemente de sucesso ou não do retorno da função assicrona
                loading.value = false
            }
        }

        onMounted(() => { // Sempre que o obejto é momento eu chamo está função  
            loading.value = true   
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    buscarDadosUsers(user.uid)
                } else {
                    console.log("Não existe usuário logado")
                    valores.value = null
                }
            }) 
            loading.value = false
        })

        onUnmounted(() => { // Sempre que o obejto é desmontado eu chamo essa função
            const UsersData = ref(database, "Users")
            off(UsersData)
        })
            
        return { // Retonro os valores para usar em outros componentes
            valores,
            buscarDadosUsers,
            loading
        }
       
    }
