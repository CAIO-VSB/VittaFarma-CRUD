<script setup>
    // Importação das bibliotecas e composables necessários
    import { computed, ref} from 'vue' // Importa funções do Vue para reatividade e computação
    import { useProdutos } from "@/composable/useProduto"; // Importa o composable que gerencia os produtos
    import Dialog from 'primevue/dialog'; // Importa o componente Dialog do PrimeVue para modais
    import { excluirProduto } from '@/repositorio-db/repositorio-db-excluir-prod'; // Importa a função que exclui produtos do banco de dados
    import { ElMessage, ElMessageBox} from 'element-plus'; // Importa componentes de mensagem e confirmação do Element Plus

    // Desestruturação do composable useProdutos para obter os dados e funções necessárias
    const { valores, buscarProdutos, loading } = useProdutos()

    // Declaração das variáveis reativas (refs) para controle da interface e dados
    const search = ref(null) // Armazena o valor da pesquisa
    const dialog = ref(false) // Controla a visibilidade do modal de detalhes
    const productData = ref(null) // Armazena os dados do produto selecionado


  /**
   * Propriedade computada que filtra os dados com base no valor de pesquisa.
   * 
   * A propriedade `filterTableData` recalcula e filtra os dados sempre que o valor de pesquisa (`search.value`) mudar. 
   * A busca é feita em múltiplas propriedades do objeto, como `name`, `ref`, `cod` e `fornecedor`, de forma insensível a maiúsculas e minúsculas.
   * 
   * **Passos:**
   * 1. Transforma o objeto `valores` em um array com `Object.values()`.
   * 2. Filtra os dados com base no valor de pesquisa digitado pelo usuário.
   * 3. Verifica se o valor de pesquisa está contido em qualquer uma das propriedades: `name`, `ref`, `cod` ou `fornecedor`.
   * 
   * **Exemplo de Filtro:**
   * Se o valor de `search.value` for "Ca", o filtro irá retornar todos os itens cujos campos `name`, `ref`, ou `fornecedor`
   * contêm a sequência "ca" (independente de maiúsculas ou minúsculas).
   * 
   * @type {import('vue').ComputedRef<Array<Object>>}
   */
    const filterTableData = computed(() =>
    Object.values(valores.value || {}).filter( //Sempre haverá um retorno de um objeto para evitar erros
        (data) =>
        !search.value || //Se a pesquisa estiver vazia, retorna todos os dados
        (data.name && data.name.toString().toLowerCase().includes(search.value.toLowerCase())) || 
        (data.ref && data.ref.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.cod && data.cod.includes(search.value)) ||
        (data.fornecedor && data.fornecedor.toString().toLowerCase().includes(search.value.toLowerCase()))
    )
    )

      // Função assíncrona para excluir um produto
      async function Delete(produto) {
        const produtoId = produto.key // Obtém o ID único do produto

        try {
          // Exibe uma caixa de diálogo de confirmação antes de excluir o produto
          await ElMessageBox.confirm("Ação permanente. Confirmar exclusão?", "Exclusão de produto", {
          confirmButtonText: "Sim", // Texto do botão de confirmação
          cancelButtonText: "Não", // Texto do botão de cancelamento
          type: "warning" // Tipo de alerta (warning = amarelo)
        })

        // Se o usuário confirmar, chama a função para excluir o produto do banco de dados
        await excluirProduto(produtoId)

        // Atualiza a lista de produtos após a exclusão
        await buscarProdutos()

        // Exibe mensagem de sucesso
        ElMessage({
          message: "Produto removido com sucesso",
          type: "success", // Tipo de mensagem (success = verde)
          duration: 3000 // Duração da mensagem em milissegundos
        })
      } catch (error) {
        // Captura e trata erros durante a exclusão
        console.log("Ocorreu um erro na promisse" + error) // Registra o erro no console
        
        // Exibe mensagem de erro para o usuário
        ElMessage({
          message: "Erro ao remover produto! Tente novamente",
          type: "error", // Tipo de mensagem (error = vermelho)
          duration: 3000 // Duração da mensagem em milissegundos
        })
      }
    }

</script>


<template>
    <!-- Comentário desativado para mostrar o total de produtos -->
    <!-- <div class="total-produtos"> <b> total de produtos: {{ totalProdutos }}</b></div> -->
    
    <!-- Div para mostrar o indicador de carregamento -->
    <div style="position: absolute;" v-loading="loading"></div>
    
    <!-- Lista colapsável de produtos -->
    <el-collapse class="div-collapase">
      <!-- Loop para renderizar cada produto na lista -->
      <el-collapse-item v-for="produto in valores" :key="produto.key" :title="produto.cod + ' - ' + produto.name + ' ' + produto.dose + ' - ' + produto.fornecedor">
        <!-- Informações do produto -->
        <div>
          <p><Strong>Codigo:</Strong> {{ produto.cod }}</p> <!-- Código do produto -->
          <p><Strong>Nome:</Strong> {{ produto.name }}</p> <!-- Nome do produto -->
          <p><Strong>Fornecedor:</Strong> {{ produto.fornecedor }}</p> <!-- Fornecedor do produto -->
          <p><Strong>Classificação:</Strong> {{ produto.classe }}</p> <!-- Classificação do produto -->
          <p><Strong>Dosagem:</Strong> {{ produto.dose }}</p> <!-- Dosagem do produto -->
          <p><Strong>Lote:</Strong> {{ produto.lote }}</p> <!-- Lote do produto -->
          <p><Strong>Nota fiscal:</Strong> {{ produto.nf }}</p> <!-- Nota fiscal do produto -->
          <p><Strong>Referência:</Strong> {{ produto.ref }}</p> <!-- Referência do produto -->
          <p><Strong>Valor unitário:</Strong> {{ produto.valor }}</p> <!-- Valor unitário do produto -->
          <p><Strong>Recomendaçãoes:</Strong> {{ produto.recomendacoes }}</p> <!-- Recomendações do produto -->
          <img class="imagem" :src="produto.imagem"> <!-- Imagem do produto, se disponível -->
        </div>
        <hr> <!-- Linha horizontal para separar as informações do botão -->
        <div>
          <!-- Botão para excluir o produto -->
          <el-button @click="Delete(produto)" type="danger">Excluir produto</el-button>
        </div>
      </el-collapse-item>
    </el-collapse> 
    
    <!-- Modal para exibir informações adicionais do produto -->
    <Dialog v-model:visible="dialog"  maximizable modal header="Informações adicionais do produto" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
           {{ "Valor do produto: " }} <b>R${{ productData.valor }}</b> <!-- Valor unitário do produto -->
        </p>
        <p>
           {{ "Recomendaçãoes do produto: " }} <b>{{ productData.recomendacoes }}</b> <!-- Recomendações do produto -->
        </p>
    </Dialog>    
  </template>

<!-- Importação do arquivo CSS específico para este componente -->
<style scoped src="./excluir-produtos.css"></style>