<script setup>
    // Importando funções e componentes necessários
    import { reactive, ref as vueRef } from 'vue';
    import { searchMedicine, createMedicine, searchClass, searchFornecedor, createClass, createFornecedor } from '@/repositorio-db/repositorio-db-faltantes';
    import { Plus } from '@element-plus/icons-vue'  // Ícone utilizado para o botão
    import { ElMessage } from 'element-plus'  // Componente para exibição de mensagens

    // Variáveis reativas para o controle dos valores e estados da aplicação
    const valorSelecionado = vueRef("") // Armazena o valor selecionado no select (categoria do item)
    const valueSelect = reactive([ // Array reativo com as opções do select
        "Nova Classe",
        "Novo Medicamento",
        "Novo Fornecedor"
    ])
    const valueNewItem = vueRef("") // Armazena o valor inserido pelo usuário (nome do item a ser criado)
    const isLoading = vueRef(false) // Controla o estado de loading (quando a ação está sendo realizada)
    const isInputError = vueRef(false) // Controla o estado de erro de entrada do usuário
    const isValidInput = vueRef(true) // Controla a validade da entrada do usuário
    
    // Função para transformar o texto inserido pelo usuário em letras maiúsculas
    const LetraMaiuscula = function() {
        valueNewItem.value = valueNewItem.value.toLocaleUpperCase()
    }

    // Função para criar um novo medicamento
    async function criarNovoMedicamento() {
        // Verifico se já existe um medicamento com o mesmo nome no banco
        const medicamentoDuplicado = await searchMedicine(valueNewItem.value.trim().toUpperCase())

        // Se existir, aviso o usuário e interrompo a execução
        if (medicamentoDuplicado) {
            ElMessage({
                message: "Valor já existente no banco de dados",
                duration: 3000,
                type: "warning"
            })
            return
        }

        // Crio o objeto com os dados do medicamento a ser armazenado
        const medicamentoData = {
            Nome: valueNewItem.value.trim().toUpperCase()
        }

        // Passo o objeto para a função de criação do medicamento e retorno a chave gerada
        const key = createMedicine(medicamentoData)

        return key
    }

    // Função para criar uma nova classe
    async function criarNovaClasse() {
        // Verifico se já existe uma classe com o nome fornecido
        const ClasseDuplicada = await searchClass(valueNewItem.value.trim().toUpperCase())

        // Se existir, aviso o usuário e interrompo a execução
        if (ClasseDuplicada) {
            ElMessage({
                message: "Valor já existente no banco de dados",
                duration: 3000,
                type: "warning"
            })
            return
        }

        // Crio o objeto com os dados da nova classe
        const ClasseData = {
            Nome: valueNewItem.value.trim().toUpperCase()
        }

        // Passo o objeto para a função de criação da classe e retorno a chave gerada
        const key = createClass(ClasseData)

        return key
    }

    // Função para criar um novo fornecedor
    async function criarNovoFornecedor() {
        // Verifico se já existe um fornecedor com o nome fornecido
        const FornecedorDuplicado = await searchFornecedor(valueNewItem.value.trim().toUpperCase())

        // Se existir, aviso o usuário e interrompo a execução
        if (FornecedorDuplicado) {
            ElMessage({
                message: "Valor já existente no banco de dados",
                duration: 4000,
                type: "warning"
            })
            return
        }

        // Crio o objeto com os dados do fornecedor
        const FornecedorData = {
            Nome: valueNewItem.value.trim().toUpperCase()
        }

        // Passo o objeto para a função de criação do fornecedor e retorno a chave gerada
        const key = createFornecedor(FornecedorData)

        return key
    }

    // Função para validar a entrada do usuário
    function valideData() {
        // Verifico se o input está vazio
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

        // Verifico se a categoria (valor selecionado) foi preenchida corretamente
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
    
    // Função que é chamada quando o usuário confirma a adição do item
    const btnConfirmar = async function() {
        // Objeto que associa cada opção ao respectivo método de criação
        const actions = {
            "Novo Medicamento": criarNovoMedicamento,
            "Nova Classe": criarNovaClasse,
            "Novo Fornecedor": criarNovoFornecedor
        }

        const isValidData = valideData() // Valido os dados inseridos pelo usuário

        // Se a validação falhar, interrompo a execução
        if (!isValidData) {
            return
        }

        // Chamo a função associada à categoria selecionada
        const action = actions[valorSelecionado.value]

        const key = await action() // Crio o item no banco de dados

        isLoading.value = true // Ativo o estado de loading (carregando)

        // Simulo um delay para a visualização do estado de loading
        await new Promise(resolve => setTimeout(resolve, 1000))

        isLoading.value = false // Desativo o estado de loading

        // Caso o item tenha sido criado com sucesso, exibo uma mensagem de sucesso
        if (key) {
            ElMessage({
                message: "Item registrado com sucesso!",
                duration: 3000,
                type: "success"
            })
        }

        // Limpo o campo de entrada
        valueNewItem.value = ""
    }

    // Função que é chamada caso o usuário cancele a operação
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
            <!-- Exibição de uma mensagem de sucesso quando necessário -->
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
                <!-- Opções de seleção (Novo Medicamento, Nova Classe, Novo Fornecedor) -->
                <el-option 
                    v-for="item in valueSelect"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>

            <div class="content-linha">Informações Adicionais</div>

            <section class="sectionNewClasse">
                <!-- Campo de input para o nome do item a ser criado -->
                <el-input v-model="valueNewItem" @keyup="LetraMaiuscula" type="text"
                    placeholder="Digite aqui..."
                    :class="{inputError: isInputError, inputNewItem: isValidInput}"
                />

                <!-- Confirmação da ação com um botão de adicionar -->
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
    </main>
</template>

<style scoped src="./Cad-Falta.css">
</style>
