<script setup>

    import { reactive, ref as vueRef } from 'vue';
    import { searchMedicine, createMedicine, searchClass, searchFornecedor, createClass, createFornecedor } from '@/repositorio-db/repositorio-db-faltantes';
    import { Plus } from '@element-plus/icons-vue'
    import { ElMessage } from 'element-plus'
 
    //Variavies reativas
    const valorSelecionado = vueRef("")
    const valueSelect = reactive([
        "Nova Classe",
        "Novo Medicamento",
        "Novo Fornecedor"
    ])
    const valueNewItem = vueRef("")
    const isLoading = vueRef(false)
    const isInputError = vueRef(false)
    const isValidInput = vueRef(true)
    
  
    //Função para transformar em letra maiuscula 
    const LetraMaiuscula = function() {
        valueNewItem.value = valueNewItem.value.toLocaleUpperCase()
    }

    async function criarNovoMedicamento() {
        const medicamentoDuplicado = await searchMedicine(valueNewItem.value.trim().toUpperCase())

        //Corrigir mensagem mostrando do loading
        if (medicamentoDuplicado) {
            ElMessage({
                message: "Valor já existente no banco de dados",
                duration: 3000,
                type: "warning"
            })
            return
        }

        const medicamentoData = {
            Nome: valueNewItem.value.trim().toUpperCase()
        }

        const key = createMedicine(medicamentoData)

        return key
    }

    async function criarNovaClasse() {
        const ClasseDuplicada = await searchClass(valueNewItem.value.trim().toUpperCase())

        if (ClasseDuplicada) {
            ElMessage({
                message: "Valor já existente no banco de dados",
                duration: 3000,
                type: "warning"
            })
            return
        }

        const ClasseData = {
            Nome: valueNewItem.value.trim().toUpperCase()
        }

        const key = createClass(ClasseData)

        return key
    }

    async function criarNovoFornecedor() {

        const FornecedorDuplicado = await searchFornecedor(valueNewItem.value.trim().toUpperCase())

        if (FornecedorDuplicado) {
            ElMessage({
                message: "Valor já existente no banco de dados",
                duration: 4000,
                type: "warning"
            })
            return
        }

        const FornecedorData = {
            Nome: valueNewItem.value.trim().toUpperCase()
        }

        const key = createFornecedor(FornecedorData)

        return key
    }

    function valideData() {
        if (!valueNewItem.value.trim()) {
            isInputError.value = true
            ElMessage({
                message: "Campo obrigatório vazio! Tente novamente",
                duration: 4000,
                type: "warning"
            })

            setTimeout(() => {
                isInputError.value = false
            }, 3000);

            return false
        }

        if (!valorSelecionado.value.trim() || valueSelect.indexOf(valorSelecionado.value.trim()) === -1) {
            isInputError.value = true
            ElMessage({
                message: "Por favor, selecione uma categoria para continuar",
                duration: 4000,
                type: "warning"
            })

            setTimeout(() => {
                isInputError.value = false
            }, 3000);

            return false
        }

        return true
    }
    
        
    const btnConfirmar = async function() {
        const actions = {
            "Novo Medicamento": criarNovoMedicamento,
            "Nova Classe": criarNovaClasse,
            "Novo Fornecedor": criarNovoFornecedor
        }

        const isValidData = valideData()

        if (!isValidData) {
            return
        }

        const action = actions[valorSelecionado.value]

        const key = await action()

        isLoading.value = true

        await new Promise(resolve => setTimeout(resolve, 1000))

        isLoading.value = false

        if (key) {
            ElMessage({
                message: "Item registrado com sucesso!",
                duration: 3000,
                type: "success"
            })
        }

        valueNewItem.value = ""
    }

    const btnCancelar = function() {
        ElMessage({
            message: "O processo foi encerrado sem modificações",
            type: "warning",
            duration: 3000,
            showClose: true
        })
    }


</script>


<template>

    <main class="container">

       <div class="alerts">
        <el-alert
        v-show="showAlert"
        title="Sucesso"
        type="success"
        description="Item adicionado com sucesso!"
        show-icon
        />
       </div>
        <div class="content-main">
           
            <div class="title-select">Item a ser adicionado</div>
            <el-select
            id="el-select"
            v-model="valorSelecionado"
            placeholder="Escolha o item a ser adicionado"
            :class="{inputError: isInputError, inputNewItem: isValidInput}"
            >

            <el-option 
            v-for=" item in valueSelect "
            :key="item"
            :label="item"
            :value="item"
            />

            </el-select>

            <div class="content-linha">Informações Adicionais</div>

            <section class="sectionNewClasse">

                 <el-input v-model="valueNewItem" @keyup="LetraMaiuscula" type="text"
                 placeholder="Digite aqui..."
                 :class="{inputError: isInputError, inputNewItem: isValidInput}"
                 />

                 <el-popconfirm title="Confirmar?" @confirm="btnConfirmar" @cancel="btnCancelar" >
                    <template #reference>
                        <el-button class="btnAdicionar"
                        type="primary" :loading="isLoading" >
                        <el-icon><Plus/></el-icon>Adicionar
                 </el-button>
                    </template>
                </el-popconfirm>
            </section>
            <section class="observacoes">
            <br>
                <p class="p-obs">
                    <strong>Obs.:</strong> Qualquer item adicionado aqui será automaticamente incrementado no painel <strong>"Cadastrar Produtos".</strong>
                </p>
                <br>
                <p>
                    <strong>Aten.: </strong>Caso tente adicionar algum item já existente, <strong>não será possível.</strong>
                </p>
            </section>
            </div>
        <div>
  </div>
    </main>
    
</template>



<style scoped src="./Cad-Falta.css">
</style>