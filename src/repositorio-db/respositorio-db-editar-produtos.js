    import { database } from "@/DB/fireBase";
    import { ref, get, update} from "firebase/database";
 
    export async function editarProduto(produtoKey, newValueName, NewValueRef, newValueDose, 
        newValueFornecedor, newValueLote, newValueNf, newValueRecomendacoes, newValueValor, newValueClasse) {

        const produtoRef = ref(database, `Produtos/${produtoKey}`)
        const snaphot = await get(produtoRef)
        if (snaphot.exists()) {
            update(produtoRef, {
                Nome: newValueName,
                Referência: NewValueRef,
                Dosagem: newValueDose,
                Fornecedor: newValueFornecedor,
                NLote: newValueLote,
                Nf: newValueNf,
                ValorUnitario: newValueValor,
                Recomendações: newValueRecomendacoes,
                Classificação: newValueClasse
            })
        }  
    }