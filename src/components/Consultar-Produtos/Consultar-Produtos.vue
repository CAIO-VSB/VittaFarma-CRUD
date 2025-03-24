<script setup>
    // Importação das bibliotecas e composables necessários
    import { ref as vueRef, watch} from "vue" // Importa funções do Vue para reatividade e observação
    import MultiSelect from 'primevue/multiselect'; // Importa o componente MultiSelect do PrimeVue para seleção múltipla
    import { useProdutos } from "@/composable/useProduto"; // Importa o composable que gerencia os produtos
    import DataTable from 'primevue/datatable'; // Importa o componente DataTable do PrimeVue para exibição de dados em tabela
    import Column from 'primevue/column'; // Importa o componente Column do PrimeVue para definir colunas da tabela
  
    // Declaração das variáveis reativas (refs) para controle da interface e dados
    const produtoSelecionado = vueRef(null) // Armazena o produto selecionado no MultiSelect
    const isVisible = vueRef(true) // Controla a visibilidade do componente de "sem dados"

    // Desestruturação do composable useProdutos para obter os dados
    const { valores } = useProdutos() // Obtém a lista de produtos

    /**
   * Escuta mudanças no select
   * E na maioria das vezes vai me retornar um array objeto
   */
    // Observa mudanças na variável produtoSelecionado e atualiza a visibilidade do componente "sem dados"
    watch(produtoSelecionado, (newValue => {
        if (newValue) {
            isVisible.value = false // Se um produto for selecionado, oculta o componente "sem dados"
        } else {
            isVisible.value = true // Se nenhum produto for selecionado, exibe o componente "sem dados"
        }
    }))
    
</script>

<template>
    <!-- Container principal do componente -->
    <main class="content-main">
        <!-- 
        OBS.: Não esqueça: O v-model está recebendo o array objeto da desestruturação
        Então qualquer tipo de manipulação será feita usando o produtoSelecionado e não { valores } Ex.: produtoSelecionado[0].nome -> Dipiriona
        E como é um array, sempre usar o [0] para pegar o primeiro item
        -->
    <!-- Seção do componente de seleção -->
    <div class="content-select">
        <!-- Componente MultiSelect do PrimeVue para seleção de produtos -->
        <MultiSelect v-model="produtoSelecionado" :options="valores"
        :optionLabel="(valor) =>  `${valor.cod} - ${valor.name}  ${valor.dose} REF.: ${valor.ref}  ${valor.fornecedor}`" filter placeholder="Selecione um produto para consulta"
        title="Pesquise por nome, referência, codigo..."
        selectedItemsLabel="Não é possível selecionar dois itens"
        emptySelectionMessage="Nenhum dado correspondente"
        emptyFilterMessage="Nenhum dado correspondente"
        emptyMessage="Nenhum dado encontrado"
        :maxSelectedLabels="10" 
        class="input-select"/>
    </div>
    
    <!-- Seção de exibição dos detalhes do produto selecionado -->
    <div class="card" v-if="produtoSelecionado">
        <!-- Tabela para exibir código e nome do produto -->
        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%;">
            <Column field="cod" header="Código" style="width: 50%;"></Column> <!-- Coluna para o código do produto -->
            <Column field="name" header="Nome" style="width: 50%;"></Column> <!-- Coluna para o nome do produto -->
        </DataTable>

        <!-- Tabela para exibir fornecedor e classificação do produto -->
        <DataTable :value="produtoSelecionado"  showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="fornecedor" header="Fornecedor" style="width: 50%;"></Column> <!-- Coluna para o fornecedor do produto -->
            <Column field="classe" header="Classificação" style="width: 50%;"></Column> <!-- Coluna para a classificação do produto -->
        </DataTable>

        <!-- Tabela para exibir dosagem e lote do produto -->
        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="dose" header="Dosagem" style="width: 50%;"></Column> <!-- Coluna para a dosagem do produto -->
            <Column field="lote" header="Lote" style="width: 50%;"></Column> <!-- Coluna para o lote do produto -->
        </DataTable>

        <!-- Tabela para exibir nota fiscal e referência do produto -->
        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="nf" header="Nota Fiscal" style="width: 50%;"></Column> <!-- Coluna para a nota fiscal do produto -->
            <Column field="ref" header="Referência" style="width: 50%;"></Column> <!-- Coluna para a referência do produto -->
        </DataTable>

        <!-- Tabela para exibir valor e recomendações do produto -->
        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="valor" header="Valor R$" style="width: 50%;"></Column> <!-- Coluna para o valor do produto -->
            <Column field="recomendacoes" header="Recomendações" style="width: 50%;"></Column> <!-- Coluna para as recomendações do produto -->
        </DataTable>
    </div>

    <!-- Componente de "sem dados" exibido quando nenhum produto está selecionado -->
    <el-empty v-if="isVisible" description= "Ainda sem dados para exibir. 😐" />

    <!-- Seção para exibir a imagem do produto selecionado -->
    <div class="produto-imagem">
        <!-- Exibe a imagem do produto se houver um produto selecionado -->
        <img class="content-imagem"  v-if="produtoSelecionado && produtoSelecionado.length" :src="produtoSelecionado[0]?.imagem">
    </div>
    
    </main>

</template>

<!-- Importação do arquivo CSS específico para este componente -->
<style src="./Prod-Search.css">

</style>