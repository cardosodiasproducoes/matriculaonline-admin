<template>
    <v-layout>
        <v-flex>
            
            <!-- Alerta de aluno salvo -->
            <v-snackbar v-model="alertaAlunoSalvo" :timeout="tempoDaMsg">{{ msgAlunoSalvo }}</v-snackbar>

            <!-- Alerta de aluno deletado -->
            <v-snackbar v-model="alertaAlunoDeletado" :timeout="tempoDaMsg" class>{{ msgAlunoDeletado }}</v-snackbar>

            <!-- Alerta de aluno matriculado em algum curso -->
            <v-snackbar v-model="alertaAlunoMatriculado" :timeout="tempoDaMsg" class>{{ msgAlunoMatriculado }}</v-snackbar>

            <!-- Card com a listagem dos alunos em uma tabela com ações a fazer como (editar, deletar) -->
            <v-card>
                <v-card-title>
                Listagem dos Alunos
                <v-spacer></v-spacer>
                <v-text-field v-model="buscarAluno" :append-icon="mdiIconSearch" label="Search" single-line hide-details></v-text-field>
                </v-card-title>

                <v-data-table :headers="cabecalhoDaTabela" :items="alunos" :search="buscarAluno">

                    <template v-slot:item.edit="{ item }">
                        <v-btn text @click="openEditAluno(item)">
                            <v-icon>{{ item.edit }}</v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:item.matricular="{ item }">
                        <v-btn text @click="abrirCaixaDeInscricao(item)">
                            <v-icon>
                                {{ item.matricular }}
                            </v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:item.matriculado="{ item }">
                        <v-btn text @click="abrirCaixaDeInscricao(item)">
                            <v-icon>
                                {{ item.matriculado }}
                            </v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:item.delete="{ item }">
                        <v-btn text @click="deletarAluno(item)">
                            <v-icon>
                                {{ item.delete }}
                            </v-icon>
                        </v-btn>
                    </template>
                    
                </v-data-table>
            </v-card>

            <!-- Caixa de Diálogo para editar os dados de um aluno já adicionado -->
            <v-row justify="start">
                <v-dialog v-model="caixaDeDialogoParaEditarUmAluno" max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Editando o cadastro:</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Digite o CPF*" v-model="cpfEdit" hint="preencha apenas números" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Digite o RG*" v-model="rgEdit" hint="Preencha apenas números" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Digite a data de nascimento*" v-model="dataNascEdit" hint="Preencha dessa forma: 10/10/1992" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Digite o nome do aluno*" v-model="nomeEdit" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="8" md="6">
                                        <v-text-field label="Digite o telefone para contato*" v-model="telefoneEdit" hint="(67)3333-3333" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small style="color: red">*Campos obrigatórios</small>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn color="error" text @click="caixaDeDialogoParaEditarUmAluno = false">Fechar</v-btn>
                            <v-btn color="success" text @click="caixaDeDialogoParaEditarUmAluno = false, editAluno()">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            
            <!-- Caixa de Diálogo para adicionar novo aluno -->
            <v-row justify="start">
                <v-dialog v-model="caixaDeDialogoParaAdicionarAluno" persistent max-width="600px">
                <template v-slot:activator="{ on }">                   
                    <v-btn class="ml-3 mt-4" v-on="on" color="success">
                        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
                        Adicionar aluno
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Nova Aluno</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field label="Digite o CPF*" v-model="cpf" hint="preencha apenas números" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field label="Digite o RG*" v-model="rg" hint="Preencha apenas números" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field label="Digite a data de nascimento*" v-model="dataNasc" hint="Preencha dessa forma: 10/10/1992" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Digite o nome do aluno*" v-model="nome" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="8" md="6">
                                    <v-text-field label="Digite o telefone para contato*" v-model="telefone" hint="(67)3333-3333" required></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small style="color: red">*Campos obrigatórios</small>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn color="error" text @click="caixaDeDialogoParaAdicionarAluno = false">Fechar</v-btn>
                        <v-btn color="success" text @click="caixaDeDialogoParaAdicionarAluno = false, adicionarAluno()">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-row>

            <!-- Caixa de Diálogo para matricular um alunoe em um curso -->
            <v-row justify="start">
                <v-dialog v-model="caixaDeDialogoParaMatricularAlunoEmUmCurso" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Matricular o Aluno:</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <h3> {{ cursoEalunoIDs.nomeDoAluno }} </h3>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <span>No curso</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-select label="Escolha o curso para matricular*" :items="cursosDoBancoDeDados" name="cursos" v-model="cursoEscolhido" item-text="curso" :return-object="selectionReturnMode" no-data-text="Não há cursos cadastrados no momento"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small style="color: red">*Campos obrigatórios</small>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn color="error" text @click="caixaDeDialogoParaMatricularAlunoEmUmCurso = false">Cancelar</v-btn>
                        <v-btn color="success" text @click="caixaDeDialogoParaMatricularAlunoEmUmCurso = false, confirmarMatricula(cursoEscolhido)">Matricular</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-row>


        </v-flex>
    </v-layout>
</template>
<script>
import linkConection from "@/links/linkConection";

export default {
    
    mounted() {
        this.buscarAlunosDoBancoDeDados()
        this.buscarCursosDoBancoDeDados()
    },

    data: () => ({
      
        // Pack de ícones
        mdiIconAccount: 'mdi-account',
        mdiIconPassword: 'mdi-numeric',
        mdiIconPasswordEye: 'mdi-eye',
        mdiIconSearch: 'mdi-laptop-windows',
        mdiDeleteIcon: 'mdi-delete',
        mdiAccountEditIcon: 'mdi-account-edit',
        mdiMatricularAlunoIcon: 'mdi-clipboard-check',

        // Cabeçalho da tabela
        cabecalhoDaTabela: [
            { text: 'CPF', value: 'cpf' },
            { text: 'RG', value: 'rg' },
            { text: 'Data de Nascimento', value: 'dataNasc' },
            { text: 'Nome', value: 'nome' },
            { text: 'Telefone', value: 'telefone' },
            { text: 'Editar', value: 'edit', align: 'center' },
            { text: 'Matricular', value: 'matricular', align: 'center' },
            { text: 'Deletar', value: 'delete', align: 'center' },
        ],
        buscarAluno: '',
        alunos: [],

        // Dados da Caixa de Diálogo para adicionar um novo aluno
        caixaDeDialogoParaAdicionarAluno: false,
        id: 3,
        cpf: '',
        rg: '',
        dataNasc: '',
        nome: '',
        telefone: '',

        // Dados da Caixa de Diálogo para editar um aluno já existente
        caixaDeDialogoParaEditarUmAluno: false,
        idEdit: '',
        cpfEdit: '',
        rgEdit: '',
        dataNascEdit: '',
        nomeEdit: '',
        telefoneEdit: '',

        // Dados do alerta de aluno salvo com sucesso
        alertaAlunoSalvo: false,
        msgAlunoSalvo: '',

        // Dados do alerta de aluno deletado com sucesso
        alertaAlunoDeletado: false,
        msgAlunoDeletado: '',
        tempoDaMsg: 2000,

        // Dados da Caixa de diálogo para matricular um aluno em um curso
        caixaDeDialogoParaMatricularAlunoEmUmCurso: false,
        cursoEalunoIDs: {},
        cursosDoBancoDeDados: [],
        cursoEscolhido: '',
        msgAlunoMatriculado: '',
        alertaAlunoMatriculado: false,
        selectionReturnMode: true,

    }),

    methods: {

        adicionarAluno() {
            let novoAluno = {}
            novoAluno.cpf = this.cpf
            novoAluno.rg = this.rg
            novoAluno.dataNasc = this.dataNasc
            novoAluno.nome = this.nome
            novoAluno.telefone = this.telefone

            linkConection.salvarAluno(novoAluno).then( alunoAdicionado => {
                if(alunoAdicionado != {} || alunoAdicionado != '' || alunoAdicionado != []){
                    this.msgAlunoSalvo = "Aluno salvo com sucesso!"
                    this.alertaAlunoSalvo = true
                    this.alunos.push(alunoAdicionado)
                    for(let i = 0; i <= this.alunos.length; i++){
                        this.alunos[i].delete = this.mdiDeleteIcon
                        this.alunos[i].matricular = this.mdiMatricularAlunoIcon
                        this.alunos[i].edit = this.mdiAccountEditIcon
                }
                }
            })
        },

        buscarAlunosDoBancoDeDados() {
            linkConection.buscarAlunosDoBanco().then(alunosEncontrados => {
                this.alunos = alunosEncontrados;
                for(let i = 0; i < this.alunos.length; i++){
                    this.alunos[i].delete = this.mdiDeleteIcon
                    this.alunos[i].matricular = this.mdiMatricularAlunoIcon
                    this.alunos[i].edit = this.mdiAccountEditIcon
                }
            })

        },

        deletarAluno(alunoAserDeletado) {
            linkConection.deletarAluno(alunoAserDeletado).then( alunoDeletado => {
                if(alunoDeletado != {} && alunoDeletado != [] && alunoDeletado != '' && alunoDeletado != undefined && alunoDeletado != null){
                    for(let i = 0; i < this.alunos.length; i++){
                        if(alunoDeletado._id === this.alunos[i]._id){
                            this.alunos.splice(i, 1)
                            this.msgAlunoDeletado = 'Aluno foi deletado com sucesso!'
                            this.alertaAlunoDeletado = true
                        }
                    }
                }
            })
        },

        openEditAluno(alunoAserEditado) {
            this.caixaDeDialogoParaEditarUmAluno = true
            this.idEdit = alunoAserEditado.id
            this.cpfEdit = alunoAserEditado.cpf
            this.rgEdit = alunoAserEditado.rg
            this.dataNascEdit = alunoAserEditado.dataNasc
            this.nomeEdit = alunoAserEditado.nome
            this.telefoneEdit = alunoAserEditado.telefone
        },

        editAluno() {
            let alunoEditado = {}
            alunoEditado.id = this.idEdit
            alunoEditado.cpf = this.cpfEdit
            alunoEditado.rg = this.rgEdit
            alunoEditado.dataNasc = this.dataNascEdit
            alunoEditado.nome = this.nomeEdit
            alunoEditado.telefone = this.telefoneEdit
            alunoEditado.delete = 'mdi-delete'
            alunoEditado.edit = 'mdi-account-edit'
            for(let i = 0; i < this.alunos.length; i++){
                if(this.alunos[i].id === alunoEditado.id){
                    this.alunos.splice(i, 1, alunoEditado)
                }
            }
        },

        abrirCaixaDeInscricao(alunoAserMatriculado) {
            this.cursoEalunoIDs._idDoAluno = alunoAserMatriculado._id
            this.cursoEalunoIDs.nomeDoAluno = alunoAserMatriculado.nome
            this.caixaDeDialogoParaMatricularAlunoEmUmCurso = true
        },

        confirmarMatricula(cursoEscolhidoParaMatricular) {
            this.cursoEalunoIDs._idDoCurso = cursoEscolhidoParaMatricular._id
            linkConection.matricularAluno(this.cursoEalunoIDs).then( alunoInscrito => {
                if(alunoInscrito != '' && alunoInscrito != {} && alunoInscrito != [] && alunoInscrito != null && alunoInscrito != undefined){
                    this.msgAlunoMatriculado = 'Aluno matriculado com sucesso!'
                    this.alertaAlunoMatriculado = true
                    this.caixaDeDialogoParaMatricularAlunoEmUmCurso = false
                }
            })
        },

        buscarCursosDoBancoDeDados() {
            linkConection.buscarCursosDoBanco().then(cursosEncontrados => {
                if(cursosEncontrados != {} && cursosEncontrados != [] && cursosEncontrados != null && cursosEncontrados != undefined && cursosEncontrados != ''){
                    this.cursosDoBancoDeDados = cursosEncontrados
                } else{
                    alert("Tá vindo no else")
                }
            })
        },

    }


}
</script>