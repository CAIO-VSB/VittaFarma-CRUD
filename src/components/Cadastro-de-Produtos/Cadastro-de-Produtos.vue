<script setup>
  // Importação das bibliotecas e componentes necessários
  import { ref as vueRef } from 'vue'; // Importa a função ref do Vue para reatividade, renomeada para vueRef
  import { ElMessage } from 'element-plus' // Importa o componente de mensagem do Element Plus
  import { useMedicamentos } from '@/composable/useMedicamento'; // Importa o composable que gerencia os medicamentos
  import { useClasse } from '@/composable/useClasse'; // Importa o composable que gerencia as classificações
  import { useFornecedor } from '@/composable/useFornecedor'; // Importa o composable que gerencia os fornecedores
  import { createProduto } from '@/repositorio-db/repositorio-db-cad-prod'; // Importa a função para criar produto no banco de dados
  import FileUpload from 'primevue/fileupload'; // Importa o componente FileUpload do PrimeVue
  import Dialog from 'primevue/dialog'; // Importa o componente Dialog do PrimeVue


  // Declaração das variáveis reativas (refs) para controle da interface e dados
  // const validRegex =  /^[A-Za-z]+$/
  const valueMedicamento = vueRef("") // Campo de medicamento
  const valuePreco = vueRef("") // Campo de preço
  const valueLote = vueRef("") // Campo de lote
  const valueFornecedor = vueRef("") // Campo de fornecedor
  const valueNota = vueRef("") // Campo de nota fiscal
  const valueDosagem = vueRef("") // Campo de dosagem
  const valueClassificação = vueRef("") // Campo de classificação
  const valueRecomendacoes = vueRef("") // Campo de recomendações
  const valueCodigo = vueRef("") // Campo de código do produto
  const valueImage = vueRef("") // Campo para armazenar a imagem em Base64
  const valueRef = vueRef("") // Campo de referência
  const isLoading = vueRef(false) // Controla o estado de carregamento do botão
  const dialogAjuda = vueRef(false) // Controla a visibilidade do diálogo de ajuda
  const dialogDica = vueRef(false) // Controla a visibilidade do diálogo de dica
  const inputvalid = vueRef(true) // Controla a validação geral dos inputs
  
  // Variáveis para controlar o estado de erro de cada campo
  const inputinvalidMedic = vueRef(false) // Estado de erro do campo de medicamento
  const inputinvalidPreco = vueRef(false) // Estado de erro do campo de preço
  const inputinvalidLote = vueRef(false) // Estado de erro do campo de lote
  const inputinvalidRef = vueRef(false) // Estado de erro do campo de referência
  const inputinvalidNf = vueRef(false) // Estado de erro do campo de nota fiscal
  const inputinvalidDose = vueRef(false) // Estado de erro do campo de dosagem
  const inputinvalidClassi = vueRef(false) // Estado de erro do campo de classificação
  const inputinvalidForne = vueRef(false) // Estado de erro do campo de fornecedor
  const isTextAreaInvalid = vueRef(false) // Estado de erro do campo de recomendações
  const isTextAreaValid = vueRef(true) // Estado de validação do campo de recomendações


 
  // Importa a função `useMedicamentos` e utiliza a desestruturação para obter a lista de medicamentos,  
  // que será utilizada no componente de seleção (MultiSelect).
  const { medicamentos } = useMedicamentos()

  // Importa a função `useClasse` e utiliza a desestruturação para obter a lista de medicamentos,  
  // que será utilizada no componente de seleção (MultiSelect).
  const { classes } = useClasse()

  // Importa a função `useFornecedor` e utiliza a desestruturação para obter a lista de medicamentos,  
  // que será utilizada no componente de seleção (MultiSelect).
  const { fornecedores } = useFornecedor()

  // Função para converter texto para maiúsculas
  function letraMaiuscula() {
    valueRecomendacoes.value = valueRecomendacoes.value.toUpperCase() // Converte recomendações para maiúsculas
    valueDosagem.value = valueDosagem.value.toUpperCase() // Converte dosagem para maiúsculas
    valueRef.value = valueRef.value.toUpperCase() // Converte referência para maiúsculas
    valueLote.value = valueLote.value.toUpperCase() // Converte lote para maiúsculas
  }

  /*
  "A função ImageBase64 permite converter um arquivo de imagem em Base64. Quando o usuário seleciona um arquivo, armazenamos esse arquivo em uma variável e verificamos se ele realmente existe. 
  Utilizamos a API FileReader para ler o arquivo de forma assíncrona e, quando a leitura termina (onload), obtemos a versão Base64 do arquivo. 
  Isso nos permite exibir imagens diretamente no navegador sem precisar enviá-las para um backend. O método readAsDataURL é o responsável por converter o arquivo para Base64."
  */

  //Função para gerar um codigo aleatorio para cada item
  function gerarCodigo() {
    //Variaveis
    let codigo = ("")
    let cache = new Set() // Conjunto para armazenar códigos já gerados

    //Loop responsável por gerar um numero aleatorio, e sempre verificar se esse numero já existe
    //Se o numero existir na coleção, ele gerar outro até ser um numero novo
    do {
      codigo = Math.floor(Math.random() * 10000) // Gera um número aleatório entre 0 e 9999
    }while(cache.has(codigo)) // Continua gerando enquanto o código já existir no cache

    cache.add(codigo) // Adiciona o código ao cache

    valueCodigo.value = String(codigo).padStart(6, "0") // Formata o código com zeros à esquerda para ter 6 dígitos
  }

  // Função para converter imagem para Base64
  function ImageBase64(event) {
    //Pegamos o primeiro arquivo selecionado pelo usuário
    //Como estamos trabalhando como upload de arquivos, em 99% dos caso ele retorna um array, por isso o uso do [0]
    const file = event.files[0] // Obtém o primeiro arquivo selecionado

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
      const image = e.target.result; // Obtém a imagem em Base64
      //console.log("Imagem base é:" + image)
      valueImage.value = image // Armazena a imagem em Base64 na variável
    }

    //Aqui é onde eu faço a conversão para base64. Assim que finalizar a leitura e conversão, o evento ONLOAD dispara.
    //Então aqui é o mais importante, sem essa linha não há conversão
    reader.readAsDataURL(file) // Inicia a leitura do arquivo como URL de dados (Base64)
  }

  //Função para validar os inputs
  function valideData() {
    let isValid = true // Variável de controle para controla quando mostrar o erro

    // Reseta todos os estados de erro
    inputinvalidMedic.value = false;
    inputinvalidForne.value = false;
    inputinvalidClassi.value = false;
    inputinvalidPreco.value = false;
    isTextAreaInvalid.value = false;
    inputinvalidRef.value = false;
    inputinvalidLote.value = false;
    inputinvalidNf.value = false;
    inputinvalidDose.value = false;

    //Verificações individuais
    if (valueMedicamento.value === "") {
      inputinvalidMedic.value = true // Ativa o estado de erro do campo de medicamento
      isValid = false // Marca a validação como falha
    }

    if (valueFornecedor.value === "") {
      inputinvalidForne.value = true // Ativa o estado de erro do campo de fornecedor
      isValid = false // Marca a validação como falha
    }

    if (valueClassificação.value === "") {
      inputinvalidClassi.value = true // Ativa o estado de erro do campo de classificação
      isValid = false // Marca a validação como falha
    }

    if (valuePreco.value === "") {
      inputinvalidPreco.value = true // Ativa o estado de erro do campo de preço
      isValid = false // Marca a validação como falha
    }

    if (!valueRecomendacoes.value.trim()) {
      isTextAreaInvalid.value = true // Ativa o estado de erro do campo de recomendações
      isValid = false // Marca a validação como falha
    }

    if (!valueRef.value.trim()) {
      inputinvalidRef.value = true // Ativa o estado de erro do campo de referência
      isValid = false // Marca a validação como falha
    }

    if (!valueLote.value.trim()) {
      inputinvalidLote.value = true // Ativa o estado de erro do campo de lote
      isValid = false // Marca a validação como falha
    }

    if (!valueNota.value.trim()) {
      inputinvalidNf.value = true // Ativa o estado de erro do campo de nota fiscal
      isValid = false // Marca a validação como falha
    }

    if (!valueDosagem.value.trim()) {
      inputinvalidDose.value = true // Ativa o estado de erro do campo de dosagem
      isValid = false // Marca a validação como falha
    }

    if (!isValid) {
      console.log("Caiu no if pipi popo") // Mensagem de depuração
    }

    //Resetar os inputs depois de 3 segundos
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

    return isValid // Retorna o valor da variável de controle
  }

    //Função para criar novo produto  
    async function criarNovoProduto() {
    try {
      //Aguardo a minha função assicrona gravar no banco de dados
      await createProduto(valueCodigo.value, valueMedicamento.value, valuePreco.value, valueLote.value, valueNota.value, valueDosagem.value, valueFornecedor.value, valueClassificação.value, valueRef.value, valueRecomendacoes.value, valueImage.value)
    } catch (error) {
      // Exibe mensagem de erro
      ElMessage({
        message: "Error ao salvar produto. Tente novamente",
        duration: 3000,
        type: "error"
      })

      console.log("error no cadastro geral" + error) // Registra o erro no console
    }
  }
 
  //Função faz a verificação dos campos e set o produto no banco
  async function btnConfirmar() {
    const isValid = valideData() // Valida os dados do formulário

    if (!isValid) {
      return // Se os dados não forem válidos, interrompe a execução da função
    }

    gerarCodigo() // Gera um código aleatório para o produto

    await criarNovoProduto() // Cria o produto no banco de dados

    isLoading.value = true // Ativa o indicador de carregamento

    await new Promise(resolve => setTimeout(resolve, 1000)) // Espera 1 segundo

    isLoading.value = false // Desativa o indicador de carregamento

    // Exibe mensagem de sucesso
    ElMessage({
        message: "Produto cadastro com sucesso!",
        duration: 3000,
        type: "success"
      })

    // limpar os campos após o cadastro
    valueClassificação.value = ""
    valueCodigo.value = ""
    valueDosagem.value = ""
    valueLote.value = ""
    valueNota.value = ""
    valuePreco.value = ""
    valueRef.value = ""
    valueMedicamento.value = ""
    valueFornecedor.value = ""
    valueRecomendacoes.value = ""    
    valueImage.value = ""
  }

  // Função chamada quando o usuário cancela o cadastro
  const btnCancelar = function() {
    // Exibe mensagem de cancelamento
    ElMessage({
      message: "Acão cancelada com sucesso!",
      duration: 2000,
      type: "warning"
    })
  }
</script>


<template>
  <!-- Container principal do formulário -->
  <main class="main">
    <el-form
    class="form"
    @submit.prevent="criarNovoProduto"
    >
    <!-- Alerta no topo do formulário -->
    <div class="alerta-form">
      <h4 class="h4"><strong>Atenção!</strong></h4>
      <p class="p-h4">
        Nomes errados dificultam a consulta. Por favor, verifique as informações antes de cadastrar.
      </p>
    </div>

    <!-- Campo de medicamento -->
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
    
    <!-- Campo de valor unitário -->
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

    <!-- Campo de referência -->
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
    
    <!-- Campo de número do lote -->
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

    <!-- Campo de número da nota fiscal -->
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
    
    <!-- Campo de dosagem -->
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
    
    <!-- Campo de fornecedor -->
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
 
    <!-- Campo de classificação -->
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
    
    <!-- Campo de recomendações -->
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

    <!-- Componente de upload de imagem -->
      <div class="upload">
        <FileUpload @select="ImageBase64" chooseLabel="Enviar foto do produto (Opcional)" mode="advanced" name="imagemProduto"  accept="image/*" :maxFileSize="2000000"
        :auto="true"
        emptyTemplate="Nenhum arquivo selecionado"
        dragdrop
        title="Imagem do produto (Opcional)"
        />
        <i class="pi pi-question-circle pi-ajuda" style="visibility: hidden" @click="dialogAjuda = true" title="Clique aqui se estiver com dúvidas"></i>
      </div>

    <!-- Alerta sobre o tamanho máximo do upload -->
    <div class="alert-tamanho-upload">
      <p>Tamanho máximo suportado: 2 mb</p>
      <i class="pi pi-question-circle pi-dica" @click="dialogDica = true" title="Clique aqui se estiver com dúvidas"></i>
    </div>
    
    <!-- Diálogo com dicas sobre o upload de imagens -->
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
   
    <!-- Botão de confirmação com popover -->
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

<!-- Importação do arquivo CSS específico para este componente com escopo limitado -->
<style scoped src="./Cad-Prod.css">
</style>