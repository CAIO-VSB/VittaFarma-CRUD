<script setup>
    // Importação das bibliotecas e composables necessários
    import { computed, ref } from 'vue' // Importa funções do Vue para reatividade
    import { useProdutos } from "@/composable/useProduto"; // Importa o composable que gerencia os produtos
    import Dialog from 'primevue/dialog'; // Importa o componente Dialog do PrimeVue para modais
    import { ElMessage} from 'element-plus'; // Importa o componente de mensagens do Element Plus
    import { editarProduto } from '@/repositorio-db/respositorio-db-editar-produtos'; // Importa a função que faz a edição no banco de dados


    // Desestruturação do composable useProdutos para obter os dados e funções necessárias
    const { valores, buscarProdutos, loading } = useProdutos()


    // Declaração das variáveis reativas (refs) para controle da interface e dados
    const dialogInfoAdicionais = ref(false) // Controla a visibilidade do modal de informações adicionais
    const dialogEditar = ref(false) // Controla a visibilidade do modal de edição
    const productData = ref(null) // Armazena os dados do produto selecionado
    
    // Refs para armazenar os novos valores durante a edição
    const newValueName = ref("") // Nome do produto
    const newValueRef = ref("") // Referência do produto
    const newValueDose = ref("") // Dosagem do produto
    const newValueFornecedor = ref("") // Fornecedor do produto
    const newValueLote = ref("") // Lote do produto
    const newValueNf = ref("") // Nota fiscal do produto
    const newValueRecomendacoes = ref("") // Recomendações do produto
    const newValueValor = ref("") // Valor unitário do produto
    const newValueClasse = ref("") // Classificação do produto
    const isLoading = ref(false) // Controla o estado de carregamento durante operações

    //Mascara para letras maiúsculas
    // Esta função converte o texto digitado para maiúsculas em tempo real
    function CaseMask() {
      newValueName.value = newValueName.value.toUpperCase() // Converte o nome para maiúsculas
      newValueRecomendacoes.value = newValueRecomendacoes.value.toUpperCase() // Converte as recomendações para maiúsculas
      newValueFornecedor.value = newValueFornecedor.value.toUpperCase() // Converte o fornecedor para maiúsculas
      newValueClasse.value = newValueClasse.value.toUpperCase() // Converte a classificação para maiúsculas
      newValueDose.value = newValueDose.value.toUpperCase() // Converte a dosagem para maiúsculas
      newValueRef.value = newValueRef.value.toUpperCase() // Converte a referência para maiúsculas
      newValueLote.value = newValueLote.value.toUpperCase() // Converte o lote para maiúsculas
    }
    
    //Função para validar os inputs
    // Verifica se todos os campos obrigatórios estão preenchidos
    function validData() {
        // Verifica se algum dos campos de texto está vazio
        if (!newValueName.value.trim() || !newValueRef.value.trim() || !newValueDose.value.trim() || !newValueFornecedor.value.trim() || !newValueLote.value.trim() || !newValueNf.value.trim() || !newValueRecomendacoes.value.trim() || !newValueClasse.value.trim() ) {
            // Exibe mensagem de erro se algum campo estiver vazio
            ElMessage({
            message: "Campo obrigatório vazio! Tente novamente",
            type: "error",
            duration: 3000 // Duração da mensagem em milissegundos
            })  

            return false // Retorna falso indicando que a validação falhou
        } 
        
        // Verifica especificamente o campo de valor unitário
        if (newValueValor.value === null || newValueValor.value === undefined || newValueValor.value === "" || newValueValor.value === 0) {
            // Exibe mensagem de erro específica para o valor unitário
            ElMessage({
            message: "Campo 'Valor Unitário incorreto'! Tente novamente",
            type: "error",
            duration: 3000 // Duração da mensagem em milissegundos
            })  

            return false // Retorna falso indicando que a validação falhou

        }

        return true // Retorna verdadeiro se todos os campos estiverem preenchidos corretamente
    }
    
    //Função para editar o produto
    // Função assíncrona que realiza a edição do produto no banco de dados
    async function Editar(produto) {
      //Recebe o identificador como argumento
      const produtoId = produto.key // Obtém o ID único do produto

        const isValidData = validData() // Verifica se os dados são válidos

        if (!isValidData) {
            return // Se os dados não forem válidos, interrompe a execução da função
        }

        loading.value = false // Desativa o indicador de carregamento (pode ser um bug, deveria ser true)
        try {
          //Aguardo a promisse ser resolvida
          // Chama a função que atualiza o produto no banco de dados
          await editarProduto(produtoId, newValueName.value, newValueRef.value, newValueDose.value, newValueFornecedor.value, newValueLote.value, newValueNf.value, newValueRecomendacoes.value, newValueValor.value, newValueClasse.value)

          await buscarProdutos() // Atualiza a lista de produtos após a edição

          // Exibe mensagem de sucesso
          ElMessage({
            message: "Produto editado com sucesso",
            type: "success",
            duration: 3000 // Duração da mensagem em milissegundos
          })

        } catch (error) {
          // Captura e trata erros durante a edição
          console.log("Ocorreu um erro na promisse" + error) // Registra o erro no console
          
          // Exibe mensagem de erro para o usuário
          ElMessage({
            message: "Erro ao concluir operação. Tente novamente",
            type: "warning",
            duration: 3000 // Duração da mensagem em milissegundos
          })
        }
    }

    // Função para abrir o modal de edição e preencher os campos com os dados atuais do produto
    function AbrirModal(produto) {
        // Preenche os campos do formulário com os valores atuais do produto
        newValueName.value = produto.name.toString() // Nome do produto
        newValueRef.value = produto.ref // Referência do produto
        newValueDose.value = produto.dose // Dosagem do produto
        newValueFornecedor.value = produto.fornecedor.toString() // Fornecedor do produto
        newValueLote.value = produto.lote // Lote do produto
        newValueNf.value = produto.nf // Nota fiscal do produto
        newValueRecomendacoes.value = produto.recomendacoes // Recomendações do produto
        newValueValor.value = produto.valor // Valor unitário do produto
        newValueClasse.value = produto.classe.toString() // Classificação do produto

        productData.value = produto // Atualiza o produto atual no momento do clique
            
        dialogEditar.value = true // Abre o modal de edição
    }

    // Função chamada quando o usuário confirma a edição
    async function bntSalvar(produto) {
        isLoading.value = true // Ativa o indicador de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000)) // Espera 1 segundo (provavelmente para feedback visual)
        productData.value = produto // Atualiza o produto atual
        Editar(productData.value) // Chama a função de edição
        isLoading.value = false // Desativa o indicador de carregamento
    }

    // Função chamada quando o usuário cancela a edição
    function bntCancelar() {
        // Exibe mensagem informando que a ação foi cancelada
        ElMessage({
            message: "Ação Cancelada sem alterações",
            type: "warning",
            duration: 3000 // Duração da mensagem em milissegundos
        })  
    }

</script>


<template>
   <!-- Div para mostrar o indicador de carregamento -->
   <div style="position: absolute;" v-loading="loading"></div>
   
   <!-- Lista colapsável de produtos -->
   <el-collapse class="div-collapase">
      <!-- Loop para renderizar cada produto na lista -->
      <el-collapse-item v-for="produto in valores" :key="produto.key" :title="produto.cod + ' - ' + produto.name + ' ' + produto.dose + ' - ' + produto.fornecedor">
        <!-- Informações do produto -->
        <div>
          <p><Strong>Codigo:</Strong> {{ produto?.cod }}</p> <!-- Código do produto com operador opcional -->
          <p><Strong>Nome:</Strong> {{ produto?.name }}</p> <!-- Nome do produto com operador opcional -->
          <p><Strong>Fornecedor:</Strong> {{ produto?.fornecedor }}</p> <!-- Fornecedor do produto com operador opcional -->
          <p><Strong>Classificação:</Strong> {{ produto?.classe }}</p> <!-- Classificação do produto com operador opcional -->
          <p><Strong>Dosagem:</Strong> {{ produto?.dose }}</p> <!-- Dosagem do produto com operador opcional -->
          <p><Strong>Lote:</Strong> {{ produto?.lote }}</p> <!-- Lote do produto com operador opcional -->
          <p><Strong>Nota fiscal:</Strong> {{ produto?.nf }}</p> <!-- Nota fiscal do produto com operador opcional -->
          <p><Strong>Referência:</Strong> {{ produto?.ref }}</p> <!-- Referência do produto com operador opcional -->
          <p><Strong>Valor unitário:</Strong> {{ produto.valor }}</p> <!-- Valor unitário do produto -->
          <p><Strong>Recomendaçãoes:</Strong> {{ produto.recomendacoes }}</p> <!-- Recomendações do produto -->
          <img class="imagem" :src="produto.imagem"> <!-- Imagem do produto, se disponível -->
        </div>
        <hr> <!-- Linha horizontal para separar as informações do botão -->
        <div>
          <!-- Botão para abrir o modal de edição -->
          <el-button @click="AbrirModal(produto)" type="primary">Editar produto</el-button>
        </div>
      </el-collapse-item>
    </el-collapse> 
    
    <!-- Modal para exibir informações adicionais do produto -->
    <Dialog v-model:visible="dialogInfoAdicionais"  maximizable modal header="Informações adicionais do produto" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <!-- Informações detalhadas do produto -->
        <p >
           {{ "Codigo do produto: " }} <b>{{ productData.cod }}</b> <!-- Código do produto -->
        </p>
        <p >
           {{ "Nome do produto: " }} <b>{{ productData.name }}</b> <!-- Nome do produto -->
        </p>
        <p>
           {{ "Fornecedor do produto: " }} <b>{{ productData.fornecedor }}</b> <!-- Fornecedor do produto -->
        </p>
        <p>
           {{ "Classificação do produto: " }} <b>{{ productData.classe }}</b> <!-- Classificação do produto -->
        </p>
        <p>
           {{ "Dosagem do produto: " }} <b>{{ productData.dose }}</b> <!-- Dosagem do produto -->
        </p>
        <p>
           {{ "Lote do produto: " }} <b>{{ productData.lote }}</b> <!-- Lote do produto -->
        </p>
        <p>
           {{ "Nota fiscal do produto: " }} <b>{{ productData.nf }}</b> <!-- Nota fiscal do produto -->
        </p>
        <p>
           {{ "Referência do produto: " }} <b>{{ productData.ref }}</b> <!-- Referência do produto -->
        </p>
        <p>
           {{ "Valor do produto: " }} <b>R$ {{ productData.valor }}</b> <!-- Valor unitário do produto -->
        </p>
        <p>
           {{ "Recomendaçãoes do produto: " }} <b>{{ productData.recomendacoes }}</b> <!-- Recomendações do produto -->
        </p>
    </Dialog>    
    
    <!-- Modal para editar as informações do produto -->
    <Dialog  :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" v-model:visible="dialogEditar" header="Novas informações" :style="{ width: '25rem' }" style="position: absolute;">
        <!-- Formulário de edição -->
        <el-form
        style="max-width: 600px"
        status-icon
        label-width="auto"
        class="form-editar"
    >
        <!-- Campo para editar o nome do produto -->
        <el-form-item label="Nome" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueName" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar a referência do produto -->
        <el-form-item label="Referência" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueRef" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar a dosagem do produto -->
        <el-form-item label="Dosagem" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueDose" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar o fornecedor do produto -->
        <el-form-item label="Fornecedor" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueFornecedor" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar a classificação do produto -->
        <el-form-item label="Classificação" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueClasse" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar o lote do produto -->
        <el-form-item label="N° do lote" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueLote" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar a nota fiscal do produto -->
        <el-form-item label="N° da nota fiscal" prop="pass">
        <el-input v-model="newValueNf" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar o valor unitário do produto -->
        <el-form-item label="Valor unitário" prop="pass">
        <el-input v-model="newValueValor" type="number" autocomplete="name" />
        </el-form-item>
        
        <!-- Campo para editar as recomendações do produto -->
        <el-form-item label="Recomendações" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueRecomendacoes" type="text" autocomplete="name" />
        </el-form-item>
        
        <!-- Botão de confirmação com popover para confirmar a ação -->
        <el-popconfirm
        @confirm="bntSalvar(productData)" 
        @cancel="bntCancelar"    
        confirm-button-text="Sim"
        cancel-button-text="Não" 
        title="Confirmar mudanças?" 
        >
        <template #reference>
            <!-- Botão que abre o popover de confirmação -->
            <el-button :loading="isLoading" type="primary">Salvar Alterações</el-button>
        </template>
        </el-popconfirm>
    </el-form>
    </Dialog>  
  </template>
  
<!-- Importação do arquivo CSS específico para este componente -->
<style scoped src="./editar-produtos.css"></style>