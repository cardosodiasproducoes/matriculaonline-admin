<template>
  <v-app>

    <!-- Toolbar do topo da página -->
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="menuDeNavegacao = !menuDeNavegacao" />
      <v-toolbar-title>Matrícula Online</v-toolbar-title>
    </v-app-bar>

    <!-- Card do Login -->
    <v-content v-if="usuarioEhAdmin == 'deslogado'">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Faça o login</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="usuario" label="Login" hint="É o seu usuário" name="login" :prepend-icon="mdiIconAccount" type="text"/>
                  <v-text-field :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" class="input-group--focused" @click:append="show2 = !show2" v-model="senha" id="password" label="Senha" name="password" :prepend-icon="mdiIconPassword" />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="success" @click="logar(usuario, senha)">Entrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <!-- Card do Admin: NavBar + Conteúdo da Página -->
    <v-content v-if="usuarioEhAdmin == 2">
      <!-- Início do NavBar -->
      <v-navigation-drawer v-model="menuDeNavegacao" temporary app>
        <v-list dense>
          
          <v-list-item>
            <v-list-item-content>
              <v-row class="fill-height">
                <v-list-item-avatar>
                  <v-img src="https://randomuser.me/api/portraits/women/75.jpg"></v-img>
                </v-list-item-avatar>
              </v-row>
              <v-list-item-title class="title">
                Fulano de tal
              </v-list-item-title>
              <v-list-item-subtitle>
                Seja bem vindo!
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <!-- Primeiro item do NavBar -->
          <router-link to="/alunos">
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-clipboard-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Alunos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>

          <!-- Segundo item do NavBar -->
          <router-link to="/cursos">
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-folder</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Cursos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>

          <v-spacer></v-spacer>

          <div class="pa-2 mb-5">
            <v-btn block dark @click="deslogar()">Sair</v-btn>
          </div>

        </v-list>
      </v-navigation-drawer>

      <!-- Conteúdo das páginas -->
      <v-content>
        <v-container class="fill-height" fluid>
          <router-view />
        </v-container>
      </v-content>
    </v-content>

    <!-- Rodapé da página -->
    <v-footer color="indigo" app>
      <span style="font-size: 10px" class="white--text">&copy; 2020 | Contato: cardosodiaseduardo@gmail.com</span>
    </v-footer>

  </v-app>
</template>

<script>

  export default {
    props: {
      source: String,
    },
    data: () => ({
      menuDeNavegacao: false,
      // usuarioLogado: false,
      usuarioEhAdmin: 'deslogado',
      usuario: '',
      senha: '',
      
      // Dados para input do password do card
      show2: false,
      
      // conjunto de ícones padrão
      mdiIconAccount: 'mdi-account',
      mdiIconPassword: 'mdi-numeric',
      mdiIconPasswordEye: 'mdi-eye',
      mdiIconSearch: 'mdi-laptop-windows',
      

    }),
    methods: {
      logar(usuarioDigitado, senhaDigitado){
        if(usuarioDigitado === 'admin' && senhaDigitado === 'admin'){
          this.usuarioEhAdmin = 2
          this.usuario = ''
          this.senha = ''
          
        } else {
          alert("Usuário não encontrado!")
          this.usuario = ''
          this.senha = ''

        }

      },
      deslogar(){
        this.usuarioEhAdmin = 'deslogado'
        this.$router.push({ path: '/' })

      }
    }

  }
</script>