<script setup>
    import { computed, ref} from 'vue'
    import { useProdutos } from "@/composable/useProduto";
    import Dialog from 'primevue/dialog';
    import { excluirProduto } from '@/repositorio-db/repositorio-db-excluir-prod';
    import { ElMessage, ElMessageBox} from 'element-plus';

    const { valores, buscarProdutos, loading } = useProdutos()

    const search = ref(null)
    const dialog = ref(false)
    const productData = ref(null)


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

      async function Delete(produto) {
        const produtoId = produto.key

        try {
          await ElMessageBox.confirm("Ação permanente. Confirmar exclusão?", "Exclusão de produto", {
          confirmButtonText: "Sim",
          cancelButtonText: "Não",
          type: "warning"
        })

        await excluirProduto(produtoId)

        await buscarProdutos()

        ElMessage({
          message: "Produto removido com sucesso",
          type: "success",
          duration: 3000 
        })
      } catch (error) {
        console.log("Ocorreu um erro na promisse" + error)
        ElMessage({
          message: "Erro ao remover produto! Tente novamente",
          type: "error",
          duration: 3000 
        })
      }
    }

</script>


<template>
    <!-- <div class="total-produtos"> <b> total de produtos: {{ totalProdutos }}</b></div> -->
    <div style="position: absolute;" v-loading="loading"></div>
    <el-collapse class="div-collapase">
      <el-collapse-item v-for="produto in valores" :key="produto.key" :title="produto.cod + ' - ' + produto.name + ' ' + produto.dose + ' - ' + produto.fornecedor">
        <div>
          <p><Strong>Codigo:</Strong> {{ produto.cod }}</p>
          <p><Strong>Nome:</Strong> {{ produto.name }}</p>
          <p><Strong>Fornecedor:</Strong> {{ produto.fornecedor }}</p>
          <p><Strong>Classificação:</Strong> {{ produto.classe }}</p>
          <p><Strong>Dosagem:</Strong> {{ produto.dose }}</p>
          <p><Strong>Lote:</Strong> {{ produto.lote }}</p>
          <p><Strong>Nota fiscal:</Strong> {{ produto.nf }}</p>
          <p><Strong>Referência:</Strong> {{ produto.ref }}</p>
          <p><Strong>Valor unitário:</Strong> {{ produto.valor }}</p>
          <p><Strong>Recomendaçãoes:</Strong> {{ produto.recomendacoes }}</p>
          <img :src="produto.imagem">
        </div>
        <hr>
        <div>
          <el-button @click="Delete(produto)" type="danger">Excluir produto</el-button>
        </div>
      </el-collapse-item>
    </el-collapse> 
    <Dialog v-model:visible="dialog"  maximizable modal header="Informações adicionais do produto" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p >
           {{ "Codigo do produto: " }} <b>{{ productData.cod }}</b>
        </p>
        <p >
           {{ "Nome do produto: " }} <b>{{ productData.name }}</b>
        </p>
        <p>
           {{ "Fornecedor do produto: " }} <b>{{ productData.fornecedor }}</b>
        </p>
        <p>
           {{ "Classificação do produto: " }} <b>{{ productData.classe }}</b>
        </p>
        <p>
           {{ "Dosagem do produto: " }} <b>{{ productData.dose }}</b>
        </p>
        <p>
           {{ "Lote do produto: " }} <b>{{ productData.lote }}</b>
        </p>
        <p>
           {{ "Nota fiscal do produto: " }} <b>{{ productData.nf }}</b>
        </p>
        <p>
           {{ "Referência do produto: " }} <b>{{ productData.ref }}</b>
        </p>
        <p>
           {{ "Valor do produto: " }} <b>R${{ productData.valor }}</b>
        </p>
        <p>
           {{ "Recomendaçãoes do produto: " }} <b>{{ productData.recomendacoes }}</b>
        </p>
    </Dialog>    
  </template>

<style scoped src="./excluir-produtos.css"></style>