
<script setup>

  import { ref as vueRef } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import MultiSelect from 'primevue/multiselect';
  import InputNumber from 'primevue/inputnumber';
  import InputText from 'primevue/inputtext';
  import { useMedicamentos } from '@/composable/useMedicamento';
  import { useClasse } from '@/composable/useClasse';
  import { useFornecedor } from '@/composable/useFornecedor';
  import { createProduto } from '@/repositorio-db/repositorio-db-cad-prod';
  import FileUpload from 'primevue/fileupload';
  import Dialog from 'primevue/dialog';


  // const validRegex =  /^[A-Za-z]+$/
  const valueMedicamento = vueRef("")
  const valuePreco = vueRef("")
  const valueLote = vueRef("")
  const valueFornecedor = vueRef("")
  const valueNota = vueRef("")
  const valueDosagem = vueRef("")
  const valueClassificação = vueRef("")
  const valueRecomendacoes = vueRef("")
  const valueCodigo = vueRef("")
  const valueImage = vueRef("")
  const valueRef = vueRef("")
  const isLoading = vueRef(false)
  const dialogAjuda = vueRef(false)
  const dialogDica = vueRef(false)
  const inputvalid = vueRef(true)
  const inputinvalidMedic = vueRef(false)
  const inputinvalidPreco = vueRef(false)
  const inputinvalidLote = vueRef(false)
  const inputinvalidRef = vueRef(false)
  const inputinvalidNf = vueRef(false)
  const inputinvalidDose = vueRef(false)
  const inputinvalidClassi = vueRef(false)
  const inputinvalidForne = vueRef(false)
  const isTextAreaInvalid = vueRef(false)
  const isTextAreaValid = vueRef(true)


  
 
  // Importa a função `useMedicamentos` e utiliza a desestruturação para obter a lista de medicamentos,  
  // que será utilizada no componente de seleção (MultiSelect).
  const { medicamentos } = useMedicamentos()

  // Importa a função `useClasse` e utiliza a desestruturação para obter a lista de medicamentos,  
  // que será utilizada no componente de seleção (MultiSelect).
  const { classes } = useClasse()

  // Importa a função `useFornecedor` e utiliza a desestruturação para obter a lista de medicamentos,  
  // que será utilizada no componente de seleção (MultiSelect).
  const { fornecedores } = useFornecedor()

  /*
  "A função ImageBase64 permite converter um arquivo de imagem em Base64. Quando o usuário seleciona um arquivo, armazenamos esse arquivo em uma variável e verificamos se ele realmente existe. 
  Utilizamos a API FileReader para ler o arquivo de forma assíncrona e, quando a leitura termina (onload), obtemos a versão Base64 do arquivo. 
  Isso nos permite exibir imagens diretamente no navegador sem precisar enviá-las para um backend. O método readAsDataURL é o responsável por converter o arquivo para Base64."
  */
  function letraMaiuscula() {
    valueRecomendacoes.value = valueRecomendacoes.value.toUpperCase()
    valueDosagem.value = valueDosagem.value.toUpperCase()
    valueRef.value = valueRef.value.toUpperCase()
    valueLote.value = valueLote.value.toUpperCase()
  }

  function gerarCodigo() {
    //Variaveis
    let codigo = ("")
    let cache = new Set()

    //Loop responsável por gerar um numero aleatorio, e sempre verificar se esse numero já existe
    //Se o numero existir na coleção, ele gerar outro até ser um numero novo
    do {
      codigo = Math.floor(Math.random() * 10000)
    }while(cache.has(codigo))

    cache.add(codigo)

    valueCodigo.value = String(codigo).padStart(6, "0")
  }

  function ImageBase64(event) {

    //Pegamos o primeiro arquivo selecionado pelo usuário
    //Como estamos trabalhando como upload de arquivos, em 99% dos caso ele retorna um array, por isso o uso do [0]
    const file = event.files[0]

    //verificação bem simples 
    if (!file) {
      alert("Nenhum arquivo selecionado")
      return;
    }

    //Aqui eu utilizo uma API padrão do JS para leitura de arquivos diretamente no navegador
    const reader = new FileReader()

    /*
    Por padrão esse tipo de evento de leituras de arquivos é assícrono, então é feita a leitura do arquivo, enquanto o restante do código executa normalmente
    Por isso na parte "reader.onload..." não executa sequencialmente ele aguarda primeiro a leitura do arquivo
    */
    reader.onload = (e) => {
      const image = e.target.result;
      //console.log("Imagem base é:" + image)
      valueImage.value = image
    }

    //Aqui é onde eu faço a conversão para base64. Assim que finalizar a leitura e conversão, o evento ONLOAD dispara.
    //Então aqui é o mais importante, sem essa linha não há conversão
    reader.readAsDataURL(file)

  }

  function valideData() {

    let isValid = true

    inputinvalidMedic.value = false;
    inputinvalidForne.value = false;
    inputinvalidClassi.value = false;
    inputinvalidPreco.value = false;
    isTextAreaInvalid.value = false;
    inputinvalidRef.value = false;
    inputinvalidLote.value = false;
    inputinvalidNf.value = false;
    inputinvalidDose.value = false;

    if (valueMedicamento.value === "") {
      inputinvalidMedic.value = true
      isValid = false
    }

    if (valueFornecedor.value === "") {
      inputinvalidForne.value = true
      isValid = false
    }

    if (valueClassificação.value === "") {
      inputinvalidClassi.value = true
      isValid = false
    }

    if (valuePreco.value === "") {
      inputinvalidPreco.value = true
      isValid = false
    }

    if (!valueRecomendacoes.value.trim()) {
      isTextAreaInvalid.value = true
      isValid = false
    }

    if (!valueRef.value.trim()) {
      inputinvalidRef.value = true
      isValid = false
    }

    if (!valueLote.value.trim()) {
      inputinvalidLote.value = true
      isValid = false
    }

    if (!valueNota.value.trim()) {
      inputinvalidNf.value = true
      isValid = false
    }

    if (!valueDosagem.value.trim()) {
      inputinvalidDose.value = true
      isValid = false
    }

    if (!isValid) {
      console.log("Caiu no if pipi popo")
    }

    setTimeout(() => {
      inputinvalidMedic.value = false;
      inputinvalidForne.value = false;
      inputinvalidClassi.value = false;
      inputinvalidPreco.value = false;
      isTextAreaInvalid.value = false;
      inputinvalidRef.value = false;
      inputinvalidLote.value = false;
      inputinvalidNf.value = false;
      inputinvalidDose.value = false;
      }, 3000);

    return isValid
  }

    async function criarNovoProduto() {

    try {
    
      await createProduto(valueCodigo.value, valueMedicamento.value, valuePreco.value, valueLote.value, valueNota.value, valueDosagem.value, valueFornecedor.value, valueClassificação.value, valueRef.value, valueRecomendacoes.value, valueImage.value)

    } catch (error) {

      ElMessage({
        message: "Error",
        duration: 3000,
        type: "error"
      })

      console.log("error na cadastro geral" + error)
    }
  
  }
 

  //Função faz a verificação dos campos e set o produto no banco
  async function btnConfirmar() {
    
    const isValid = valideData()

    if (!isValid) {
      return
    }

    gerarCodigo()

    await criarNovoProduto()

    isLoading.value = true

    await new Promise(resolve => setTimeout(resolve, 1000))

    isLoading.value = false

    ElMessage({
        message: "Produto cadastro com sucesso!",
        duration: 3000,
        type: "success"
      })

    // valueClassificação.value = ""
    // valueCodigo.value = ""
    // valueDosagem.value = ""
    // valueLote.value = ""
    // valueNota.value = ""
    // valuePreco.value = ""
    // valueRef.value = ""
    // valueMedicamento.value = ""
    // valueFornecedor.value = ""
    // valueRecomendacoes.value = ""    
    // valueImage.value = ""

  }

  const btnCancelar = function() {
    ElMessage({
      message: "Acão cancelada com sucesso!",
      duration: 2000,
      type: "warning"
    })

  }


</script>


<template>

  <main class="main">
    <el-form
    class="form"
    @submit.prevent="criarNovoProduto"
    >

    <div class="alerta-form">
      <h4 class="h4"><strong>Atenção!</strong></h4>
      <p class="p-h4">
        Nomes errados dificultam a consulta. Por favor, verifique as informações antes de cadastrar.
      </p>
    </div>

    <div>
    <label class="label-medicamento" for="valueMedicamento">Medicamento*</label>
    <div class="form-content-item">
    <el-select
      v-model="valueMedicamento"
      filterable
      placeholder="Clique e escolha o medicamento"
      :class="{inputContainer: inputvalid, inputContainerErrorMedic: inputinvalidMedic}"
      >
      <el-option
        v-for="item in medicamentos"
        :key="item.Name"
        :label="item.Name"
        :value="item.Name"
      />
      </el-select>
    </div>
    </div>
    
    <div>
    <label for="valuePreco">Valor Unitário*</label>
    <div class="form-content-item">
      <el-input
      v-model="valuePreco"
      :class="{inputContainerPreco: inputvalid, inputContainerErrorPreco: inputinvalidPreco}" 
      placeholder="Digite o valor neste campo"
      show-word-limit
      maxlength="20"
      :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
      :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
    />
    </div>
    </div>

    <div>
    <label for="valueRef">Referência*</label>
    <div class="form-content-item">               
      <el-input
      v-model="valueRef"
      :class="{inputContainer: inputvalid, inputContainerErrorRef: inputinvalidRef}" 
      maxlength="20"
      placeholder="Digite o valor neste campo"
      show-word-limit
      type="text"
    />
    </div>
    </div>
    
    <div>
    <label  for="valueLote">N° do Lote*</label>
    <div class="form-content-item">
      <el-input
      v-model="valueLote"
      :class="{inputContainer: inputvalid, inputContainerErrorLote: inputinvalidLote}" 
      maxlength="20"
      placeholder="Digite o lote neste campo"
      show-word-limit
      type="text"
    />
    </div>
    </div>

    <div>
    <label  for="valueNF">N° da NF*</label>
    <div class="form-content-item">
      <el-input
      v-model="valueNota"
      :class="{inputContainer: inputvalid, inputContainerErrorNf: inputinvalidNf}"
      maxlength="20"
      placeholder="Digite a nota fiscal neste campo"
      show-word-limit
      type="text"
    />
    </div>
    </div>
    
    <div class="">
      <label for="valueNF">Dosagem*</label>
      <div class="form-content-item">
        <el-input
        v-model="valueDosagem"
        :class="{inputContainer: inputvalid, inputContainerErrorDose: inputinvalidDose}" 
        maxlength="20"
        placeholder="Digite a nota fiscal neste campo"
        show-word-limit
        type="text"
      />
      </div>
    </div>
    
    <div class="form-item-geral">
      <label class="label" for="valueFornecedor">Fornecedor*</label>
      <el-select
      v-model="valueFornecedor"
      filterable
      placeholder="Clique e escolha o medicamento"
      :class="{inputContainer: inputvalid, inputContainerErrorForne: inputinvalidForne}"
      show-word-limit
      maxlength="20"
      >
      <el-option
        v-for="item in fornecedores"
        :key="item.Name"
        :label="item.Name"
        :value="item.Name"
      />
      </el-select>
    </div>
 
    <div class="form-item-geral">
      <label class="label" for="valueClassificação">Classificação*</label>
      <el-select
      v-model="valueClassificação"
      filterable
      placeholder="Clique e escolha o medicamento"
     :class="{inputContainer: inputvalid, inputContainerErrorClassi: inputinvalidClassi}"
      show-word-limit
      maxlength="20"
      >
      <el-option
        v-for="item in classes"
        :key="item.Name"
        :label="item.Name"
        :value="item.Name"
      />
      </el-select>
    </div>
    
    <div class="form-item-geral">
      <label class="label" for="valueRecomendacoes">Recomendacões*</label>
      <div class="inputTextArea">
        <el-input
        v-model="valueRecomendacoes"
        maxlength="255"
        placeholder="Ex.: Tomar de 8 em 8 horas."
        show-word-limit
        type="textarea"
        :class="{contenttextarea: isTextAreaInvalid, inputTextArea: isTextAreaValid}"
        title="Insira algumas recomendações do medicamento"
        @keyup="letraMaiuscula"
      />
      </div>
    </div>

      <div class="upload">
        <FileUpload @select="ImageBase64" chooseLabel="Enviar foto do produto (Opcional)" mode="advanced" name="imagemProduto"  accept="image/*" :maxFileSize="2000000"
        :auto="true"
        emptyTemplate="Nenhum arquivo selecionado"
        dragdrop
        title="Imagem do produto (Opcional)"
        />
        <i class="pi pi-question-circle pi-ajuda" style="visibility: hidden" @click="dialogAjuda = true" title="Clique aqui se estiver com dúvidas"></i>
      </div>

    <div class="alert-tamanho-upload">
      <p>Tamanho máximo suportado: 2 mb</p>
      <i class="pi pi-question-circle pi-dica" @click="dialogDica = true" title="Clique aqui se estiver com dúvidas"></i>
    </div>
    <div>
      <Dialog v-model:visible="dialogDica" maximizable modal header="Dica" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="m-0">
          "Se o tamanho do arquivo exceder o limite permitido, recomendamos:
          Utilizar ferramentas online gratuitas para reduzir o tamanho da imagem.
          Ajustar a imagem por meio de recorte, redimensionamento, compressão ou conversão para o formato .webp.
          Isso contribui para um carregamento mais rápido do site e otimiza o uso do armazenamento."
        </p>
        <p>...........................................................................................................................................................................................</p>
        <p class="m-0">
          "Selecione uma única imagem correspondente ao produto cadastrado. Você pode fazer isso de duas formas: arrastando e soltando a imagem na área destacada ou clicando no botão correspondente para selecionar o arquivo manualmente."
        </p>
      </Dialog>
    </div>
   
    <el-popconfirm title="Confirmação de cadastro do produto no banco de dados."
    @confirm="btnConfirmar" 
    @cancel="btnCancelar" 
    confirm-button-text="Sim"
    cancel-button-text="Não"
    >
      <template #reference>
      <div class="div-bnt">
        <el-button :loading="isLoading" type="primary">Cadastrar
          <el-icon class="icon"><Plus /></el-icon>
        </el-button>
    </div>
      </template>
    </el-popconfirm>
    </el-form>

  </main>

  </template>

<style scoped src="./Cad-Prod.css">


</style>
  


