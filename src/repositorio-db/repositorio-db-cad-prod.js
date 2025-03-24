    
    import { database } from "@/DB/fireBase";
    import { push, ref, set } from "firebase/database";


    export async function createProduto(codigo, nome, valor, lote, nf, dose, fornecedor, classe, referência, recomendações, image) {
        const produtoRef = ref(database, "Produtos")
        const produtoKey = push(produtoRef)
        await set(produtoKey, {
            Cod: codigo, 
            Nome: nome,
            ValorUnitario: valor,
            NLote: lote,
            Nf: nf,
            Dosagem: dose,
            Fornecedor: fornecedor,
            Classificação: classe,
            Recomendações: recomendações,
            Referência: referência,
            Image: image
        })

        return produtoKey.key
    }
