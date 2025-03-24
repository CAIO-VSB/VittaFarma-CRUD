<script setup>
    
    import { computed, ref } from 'vue'
    import { useProdutos } from "@/composable/useProduto";
    import Dialog from 'primevue/dialog';
    import { ElMessage} from 'element-plus';
    import { editarProduto } from '@/repositorio-db/respositorio-db-editar-produtos';


    const { valores, buscarProdutos, loading, totalProdutos } = useProdutos()

    const search = ref(null)
    const dialogInfoAdicionais = ref(false)
    const dialogEditar = ref(false)
    const productData = ref(null)
    const newValueName = ref("")
    const newValueRef = ref("")
    const newValueDose = ref("")
    const newValueFornecedor = ref("")
    const newValueLote = ref("")
    const newValueNf = ref("")
    const newValueRecomendacoes = ref("")
    const newValueValor = ref("")
    const newValueClasse = ref("")
    const isLoading = ref(false)


  /*
  Crio uma propriedade computada (reativa) para recalcular sempre algum dado mudar no input
    Passo 1 - 'Object.values(valores.value || {}).filter': Transformo em um array para manipulção e faço uma condicão 
    pare sempre retonar um objeto, mesmo que seja vazio.
    Passo 2 - Aplico um filtro para me retorna um novo array somente com com as escolhas do usuário.
    Mas antes eu verifico se tem algum nome para validação.
    Ex.: ["Caio"]
    Se o usuário digitar "Ca", o filter vai chamar todo e qualquer nome contendo esses caracteres, então o computed recalcula
    o array, assim sucessivamente
  */

    const filterTableData = computed(() =>
    Object.values(valores.value || {}).filter(
        (data) =>
        !search.value ||
        (data.name.toString() && data.name.toString().toLowerCase().includes(search.value.toLowerCase())) || 
        (data.ref && data.ref.toLowerCase().includes(search.value.toLowerCase())) ||
        (data.cod && data.cod.includes(search.value)) ||
        (data.fornecedor.toString() && data.fornecedor.toString().toLowerCase().includes(search.value.toLowerCase()))
    )
    )

    function CaseMask() {
      newValueName.value = newValueName.value.toUpperCase()
      newValueRecomendacoes.value = newValueRecomendacoes.value.toUpperCase()
      newValueFornecedor.value = newValueFornecedor.value.toUpperCase()
      newValueClasse.value = newValueClasse.value.toUpperCase()
      newValueDose.value = newValueDose.value.toUpperCase()
      newValueRef.value = newValueRef.value.toUpperCase()
      newValueLote.value = newValueLote.value.toUpperCase()
    }
    
    function validData() {
        if (!newValueName.value.trim() || !newValueRef.value.trim() || !newValueDose.value.trim() || !newValueFornecedor.value.trim() || !newValueLote.value.trim() || !newValueNf.value.trim() || !newValueRecomendacoes.value.trim() || !newValueClasse.value.trim() ) {
            ElMessage({
            message: "Campo obrigatório vazio! Tente novamente",
            type: "error",
            duration: 3000 
            })  

            return false
        } 
        
        if (newValueValor.value === null || newValueValor.value === undefined || newValueValor.value === "" || newValueValor.value === 0) {
            ElMessage({
            message: "Campo 'Valor Unitário incorreto'! Tente novamente",
            type: "error",
            duration: 3000 
            })  

            return false

        }

        return true
    }
    
    async function Editar(produto) {
      const produtoId = produto.key

        const isValidData = validData()

        if (!isValidData) {
            return
        }

        loading.value = false
        try {
          await editarProduto(produtoId, newValueName.value, newValueRef.value, newValueDose.value, newValueFornecedor.value, newValueLote.value, newValueNf.value, newValueRecomendacoes.value, newValueValor.value, newValueClasse.value)

          await buscarProdutos()

          
          ElMessage({
            message: "Produto editado com sucesso",
            type: "success",
            duration: 3000 
          })

        } catch (error) {
          console.log("Ocorreu um erro na promisse" + error)
          
          ElMessage({
            message: "Erro ao concluir operação. Tente novamente",
            type: "warning",
            duration: 3000 
          })
        }
    }

    function AbrirModal(produto) {
        newValueName.value = produto.name.toString()
        newValueRef.value = produto.ref
        newValueDose.value = produto.dose
        newValueFornecedor.value = produto.fornecedor.toString()
        newValueLote.value = produto.lote
        newValueNf.value = produto.nf
        newValueRecomendacoes.value = produto.recomendacoes
        newValueValor.value = produto.valor
        newValueClasse.value = produto.classe.toString()

        productData.value = produto // Atualizo o produto atual no momento do clique
            
        dialogEditar.value = true
    }

    function infoAdicionais(produto) {
      productData.value = produto
      console.log(productData.value)
      dialogInfoAdicionais.value = true
    }

    async function bntSalvar(produto) {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, 1000)) 
        productData.value = produto
        Editar(productData.value)
        isLoading.value = false
    }

    function bntCancelar() {
        ElMessage({
            message: "Ação Cancelada sem alterações",
            type: "warning",
            duration: 3000 
        })  
    }

</script>


<template>
   <div style="position: absolute;" v-loading="loading"></div>
   <!-- <div class="total-produtos"> <b> Total de Produtos: {{ totalProdutos }}</b></div> -->
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
          <el-button @click="AbrirModal(produto)" type="primary">Editar produto</el-button>
        </div>
      </el-collapse-item>
    </el-collapse> 
    <Dialog v-model:visible="dialogInfoAdicionais"  maximizable modal header="Informações adicionais do produto" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
           {{ "Valor do produto: " }} <b>R$ {{ productData.valor }}</b>
        </p>
        <p>
           {{ "Recomendaçãoes do produto: " }} <b>{{ productData.recomendacoes }}</b>
        </p>
    </Dialog>    
    <Dialog  :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" v-model:visible="dialogEditar" header="Novas informações" :style="{ width: '25rem' }" style="position: absolute;">
        <el-form
        style="max-width: 600px"
        status-icon
        label-width="auto"
        class="form-editar"
    >
        <el-form-item label="Nome" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueName" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="Referência" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueRef" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="Dosagem" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueDose" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="Fornecedor" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueFornecedor" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="Classificação" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueClasse" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="N° do lote" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueLote" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="N° da nota fiscal" prop="pass">
        <el-input v-model="newValueNf" type="text" autocomplete="name" />
        </el-form-item>
        <el-form-item label="Valor unitário" prop="pass">
        <el-input v-model="newValueValor" type="number" autocomplete="name" />
        </el-form-item>
        <el-form-item label="Recomendações" prop="pass">
        <el-input @keyup="CaseMask" v-model="newValueRecomendacoes" type="text" autocomplete="name" />
        </el-form-item>
        <el-popconfirm
        @confirm="bntSalvar(productData)"
        @cancel="bntCancelar"
        confirm-button-text="Sim"
        cancel-button-text="Não"
        title="Confirmar mudanças?"
        >
        <template #reference>
            <el-button :loading="isLoading" type="primary">Salvar Alterações</el-button>
        </template>
        </el-popconfirm>
    </el-form>
    </Dialog>  
  </template>
<style scoped src="./editar-produtos.css"></style>