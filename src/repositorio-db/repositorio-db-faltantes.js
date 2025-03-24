
    import { database } from "@/DB/fireBase";
    import { equalTo, get, orderByChild, push, query, ref, set } from "firebase/database";

    export async function searchMedicine(medicamento) {
        const medicamentoRef = ref(database, "MedicamentosName")
        const queryMedicamento = query(medicamentoRef, orderByChild("Nome"), equalTo(medicamento))
        const snaphotMedicamento = await get(queryMedicamento)
        return snaphotMedicamento.val()
    }

    export async function createMedicine(medicamento) {
        const medicamentoRef = ref(database, "MedicamentosName")
        const medicamentoKey = push(medicamentoRef)
        await set(medicamentoKey, medicamento)
        return medicamentoKey.key
    }

    export async function searchClass(classe) {
        const ClasseRef = ref(database, "ClasseName")
        const queryClasse = query(ClasseRef, orderByChild("Nome"), equalTo(classe))
        const snaphotClasse = await get(queryClasse)
        return snaphotClasse.val()
    }

    export async function createClass(classe) {
        const ClasseRef = ref(database, "ClasseName")
        const ClasseKey = push(ClasseRef)
        await set(ClasseKey, classe)
        return ClasseKey.key
    }

    export async function searchFornecedor(fornecedor) {
        const fornecedorRef = ref(database, "FornecedorName")
        const fornecedorQuery = query(fornecedorRef, orderByChild("Nome"), equalTo(fornecedor))
        const snaphotFornecedor = await get(fornecedorQuery)
        return snaphotFornecedor.val()
    }

    export async function createFornecedor(fornecedor) {
        const fornecedorRef = ref(database, "FornecedorName")
        const fornecedorKey = push(fornecedorRef)
        await set(fornecedorKey, fornecedor)
        return fornecedorKey.key
    }