    import { database } from "@/DB/fireBase";
    import { ref, get, off } from "firebase/database";
    import { onMounted, onUnmounted, ref as vueref } from "vue"

    export function useProdutos() {
        
        const valores = vueref([]) // Variavel reativa para os valores filtrados

        const loading = vueref(true) // Variavel reativa para o loading


        const  buscarProdutos = async () => {
            loading.value = true // Inico do loading de carregamento
            try {
                const produtoRef = ref(database, "Produtos") // Referencia ao nó no DB
                const snapshot = await get(produtoRef) // Caputra do dados no momento da consulta
        
                if (snapshot.exists()) { // Verifico se existe algum dado
                    const produtosData = snapshot.val() // Armazeno esses dados em uma variavel
                    const arrayProdutos = []
        
                    for (let produto in produtosData) { // Intero sobre o objeto para extrair informações e manipulação de dados
                        arrayProdutos.push({ 
                            key: produto, //Aqui eu passo o identificador gerado pelo firebase
                            imagem: produtosData[produto].Image, // Acesso o meu obejto e extraio somente a imagem 
                            cod: produtosData[produto].Cod, // Mesma logica da imagem
                            name: produtosData[produto].Nome.toString(),
                            fornecedor: produtosData[produto].Fornecedor.toString(),
                            classe: produtosData[produto].Classificação.toString(),
                            dose: produtosData[produto].Dosagem,
                            lote: produtosData[produto].NLote,
                            nf: produtosData[produto].Nf,
                            recomendacoes: produtosData[produto].Recomendações,
                            ref: produtosData[produto].Referência,
                            valor: produtosData[produto].ValorUnitario
                        })
                    }
                    valores.value = arrayProdutos // Armazeno os dados extraídos do arrayProdutos no array valores

                }a
            }catch(error) { // Propriedade para lidar somente com erros das promisses
                console.log("error: " + error)
            } finally { // Propriedada usada para encerrar o loading independemente de sucesso ou não do retorno da função assicrona
                loading.value = false
            }
        }

        onMounted(() => { // Sempre que o obejto é momento eu chamo está função
            buscarProdutos()
        })

        onUnmounted(() => { // Sempre que o obejto é desmontado eu chamo essa função
            const produtoRef = ref(database, "Produtos")
            off(produtoRef)
        })
            
        return { // Retonro os valores para usar em outros componentes
            valores,
            buscarProdutos,
            loading, 
        }
       
    }

