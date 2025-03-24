<script setup>

    import { ref as vueRef, watch} from "vue"
    import MultiSelect from 'primevue/multiselect';
    import { useProdutos } from "@/composable/useProduto";
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
  
    const produtoSelecionado = vueRef(null)
    const isVisible = vueRef(true)

    const { valores, buscarProdutos } = useProdutos()

    /**
   * Escuta mudanças no select
   * E na maioria das vezes vai me retornar um array objeto
   */
    watch(produtoSelecionado, (newValue => {
        if (newValue) {
            isVisible.value = false   
        } else {
            isVisible.value = true
        }
    }))

    buscarProdutos()
    
</script>

<template>

    <main class="content-main">
        <!-- 
        OBS.: Não esqueça: O v-model está recebendo o array objeto da desestruturação
        Então qualquer tipo de manipulação será feita usando o produtoSelecionado e não { valores } Ex.: produtoSelecionado[0].nome -> Dipiriona
        E como é um array, sempre usar o [0] para pegar o primeiro item
        -->
    <div class="content-select">
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
    <div class="card" v-if="produtoSelecionado">

        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%;">
            <Column field="cod" header="Código" style="width: 50%;"></Column>
            <Column field="name" header="Nome" style="width: 50%;"></Column>
        </DataTable>

        <DataTable :value="produtoSelecionado"  showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="fornecedor" header="Fornecedor" style="width: 50%;"></Column>
            <Column field="classe" header="Classificação" style="width: 50%;"></Column>
        </DataTable>

        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="dose" header="Dosagem" style="width: 50%;"></Column>
            <Column field="lote" header="Lote" style="width: 50%;"></Column>
        </DataTable>

        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="nf" header="Nota Fiscal" style="width: 50%;"></Column>
            <Column field="ref" header="Referência" style="width: 50%;"></Column>
        </DataTable>

        <DataTable :value="produtoSelecionado" showGridlines style="width: 100%; margin-top: 10px;">
            <Column field="valor" header="Valor R$" style="width: 50%;"></Column>
            <Column field="recomendacoes" header="Recomendações" style="width: 50%;"></Column>
        </DataTable>
    </div>

    <el-empty v-if="isVisible" description= "Ainda sem dados para exibir. 😐" />

    <div class="produto-imagem">
        <img class="content-imagem"  v-if="produtoSelecionado && produtoSelecionado.length" :src="produtoSelecionado[0].imagem">
    </div>
    
    </main>

</template>

<style src="./Prod-Search.css">

</style>