    import { database } from "@/DB/fireBase";
    import { ref, get, remove} from "firebase/database";
 
    export async function excluirProduto(produtoKey) {

        const produtoRef = ref(database, `Produtos/${produtoKey}`)
        const snaphot = await get(produtoRef)
        if (snaphot.exists()) {
            remove(produtoRef)
        }  
    }