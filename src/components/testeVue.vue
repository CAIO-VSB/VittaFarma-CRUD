<template>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(produto) in produtos" :key="produto.id" :title="produto.nome" :name="produto.id.toString()">
        <!-- Informações detalhadas do produto -->
        <div>
          <p><strong>Código:</strong> {{ produto.codigo }}</p>
          <p><strong>Descrição:</strong> {{ produto.descricao }}</p>
          <p><strong>Preço:</strong> R$ {{ produto.preco }}</p>
          <el-button type="danger" @click="excluirProduto(produto.id)">Excluir</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeNames: [],  // Controle dos itens expandidos
        // Dados dos produtos
        produtos: [
          { id: 1, nome: 'Produto 1', codigo: 'P001', descricao: 'Descrição do produto 1', preco: 50.00 },
          { id: 2, nome: 'Produto 2', codigo: 'P002', descricao: 'Descrição do produto 2', preco: 30.00 },
          { id: 3, nome: 'Produto 3', codigo: 'P003', descricao: 'Descrição do produto 3', preco: 70.00 }
        ]
      };
    },
    methods: {
      handleChange() {
        console.log('Mudança no colapso');
      },
      excluirProduto(id) {
        // Aqui você pode fazer a exclusão no banco de dados
        // Por exemplo, removendo o produto da lista local
        this.produtos = this.produtos.filter(produto => produto.id !== id);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos adicionais se necessário */
  </style>
  