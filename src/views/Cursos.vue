<template>
    <v-layout>
        <v-flex>

            <!-- Alerta de aluno salvo -->
            <v-snackbar v-model="alertaCursoSalvo" :timeout="tempoDaMsg">{{ msgCursoSalvo }}</v-snackbar>

            <!-- Alerta de aluno salvo -->
            <v-snackbar v-model="alertaCursoDeletado" :timeout="tempoDaMsg">{{ msgCursoDeletado }}</v-snackbar>

            <!-- Tabela com as secretarias -->
            <v-card>
                <v-card-title>
                Listagem dos cursos
                <v-spacer></v-spacer>
                <v-text-field v-model="search" :append-icon="mdiIconSearch" label="Search" single-line hide-details></v-text-field>
                </v-card-title>

                <v-data-table :headers="cabecalhoDaTabela" :items="cursos" :search="search">
                    <template v-slot:item.mensalidade="{ item }">
                        <span> R$ {{item.mensalidade}} </span>
                    </template>
                    <template v-slot:item.matricula="{ item }">
                        <span> R$ {{item.matricula}} </span>
                    </template>
                    <template v-slot:item.tempo="{ item }">
                        <span> {{ item.tempo }} meses </span>
                    </template>
                    <template v-slot:item.delete="{ item }">
                        <v-btn text @click="deletarCurso(item)">
                            <v-icon>{{ item.delete }}</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:item.edit="{ item }">
                        <v-btn text @click="openEditCurso(item)">
                            <v-icon>{{ item.edit }}</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>

            <!-- Botão para adicionar um novo curso -->
            <v-btn class="ml-2 mt-4" color="success" @click="caixaDeDialogoParaAdicionarUmCurso = true">
                <v-icon class="mr-2">mdi-clipboard-plus</v-icon>
                Adicionar Curso
            </v-btn>

            <!-- Caixa de Diálogo para adicionar um novo curso -->
            <v-row justify="start">
                <v-dialog v-model="caixaDeDialogoParaAdicionarUmCurso" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Nova Secretaria</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Digite o curso*" v-model="curso" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field label="Valor da Mensalidade*" v-model="mensalidade" hint="Digite apenas valores sem simbolos como R$" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field label="Valor da Matricula*" v-model="matricula" hint="Digite apenas valores sem simbolos como R$" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-select label="Período do curso*" :items="opcoesDoPeriodo" v-model="periodo" required></v-select>
                                </v-col>
                                <v-col cols="12" sm="8" md="6">
                                    <v-text-field label="Duração (em meses) do curso*" v-model="tempo" hint="Digite apenas a quantidade de meses" required></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                        <small style="color: red">*Campos obrigatórios</small>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn color="error" text @click="caixaDeDialogoParaAdicionarUmCurso = false">Fechar</v-btn>
                        <v-btn color="success" text @click="caixaDeDialogoParaAdicionarUmCurso = false, adicionarCurso()">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-row>

            <!-- Caixa de Diálogo para editar um curso existente -->
            <v-row justify="start">
                <v-dialog v-model="caixaDeDialogoParaEditarUmCurso" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Editando o curso</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Digite o curso*" v-model="cursoEdit" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Valor da Mensalidade*" v-model="mensalidadeEdit" hint="Digite apenas valores sem simbolos" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field label="Valor da Matricula*" v-model="matriculaEdit" hint="Digite apenas valores sem simbolos" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select label="Período do curso*" :items="opcoesDoPeriodo" v-model="periodoEdit" required></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="8" md="6">
                                        <v-text-field label="Duração (em meses) do curso*" v-model="tempoEdit" hint="Digite apenas a quantidade de meses" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small style="color: red">*Campos obrigatórios</small>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn color="error" text @click="caixaDeDialogoParaEditarUmCurso = false">Fechar</v-btn>
                            <v-btn color="success" text @click="caixaDeDialogoParaEditarUmCurso = false, editCurso()">Salvar</v-btn>
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

    data: () => ({
    
        // Pack de ícones
        mdiIconAccount: 'mdi-account',
        mdiIconPassword: 'mdi-numeric',
        mdiIconPasswordEye: 'mdi-eye',
        mdiIconSearch: 'mdi-laptop-windows',
        mdiDeleteIcon: 'mdi-delete',
        mdiAccountEditIcon: 'mdi-account-edit',
        mdiMatricularAlunoIcon: 'mdi-clipboard-check',

        // Dados para a tabela dos cursos
        cabecalhoDaTabela: [
            { text: 'curso', value: 'curso' },
            { text: 'Valor da Mensalidade', value: 'mensalidade' },
            { text: 'Valor da Matrícula', value: 'matricula' },
            { text: 'periodo', value: 'periodo' },
            { text: 'Meses de Duração', value: 'tempo', align: 'center' },
            { text: 'Deletar', value: 'delete', align: 'center' },
            { text: 'Editar', value: 'edit', align: 'center' },
        ],
        search: '',
        cursos: [],

        // Dados da Caixa de Diálogo para adicionar um novo curso
        caixaDeDialogoParaAdicionarUmCurso: false,
        opcoesDoPeriodo: [ 'Matutino', 'Vespertino', 'Noturno' ],
        id: 4,
        curso: '',
        mensalidade: '',
        matricula: '',
        periodo: '',
        tempo: '',

        // Dados da Caixa de Diálogo para editar um curso existente
        caixaDeDialogoParaEditarUmCurso: false,
        objetoMarcadoParaEdicaoDoCurso: {},
        idEdit: '',
        cursoEdit: '',
        mensalidadeEdit: '',
        matriculaEdit: '',
        periodoEdit: '',
        tempoEdit: '',

        // Dados do snackbar para quando salvo um curso novo
        msgCursoSalvo: '',
        alertaCursoSalvo: false,
        tempoDaMsg: 2000,

        //Dados do snackbar para quando deletado um curso
        msgCursoDeletado: '',
        alertaCursoDeletado: false,

    }),

    mounted() {
        this.buscarCursosDoBancoDeDados()
    },

    methods: {

        adicionarCurso() {
            let novoCurso = {}
            novoCurso.curso = this.curso
            novoCurso.mensalidade = this.mensalidade
            novoCurso.matricula = this.matricula
            novoCurso.periodo = this.periodo
            novoCurso.tempo = this.tempo

            linkConection.salvarCurso(novoCurso).then( cursoAdicionado => {
                if(cursoAdicionado != {} || cursoAdicionado != '' || cursoAdicionado != []){
                    this.msgCursoSalvo = "Curso salvo com sucesso!"
                    this.alertaCursoSalvo = true
                    this.cursos.push(cursoAdicionado)
                    for(let i = 0; i <= this.cursos.length; i++){
                        this.cursos[i].delete = this.mdiDeleteIcon
                        this.cursos[i].matricular = this.mdiMatricularAlunoIcon
                        this.cursos[i].edit = this.mdiAccountEditIcon
                }
                }
            })

        },

        buscarCursosDoBancoDeDados(){
            linkConection.buscarCursosDoBanco().then(cursosEncontrados => {
                this.cursos = cursosEncontrados;
                for(let i = 0; i < this.cursos.length; i++){
                    this.cursos[i].delete = this.mdiDeleteIcon
                    // this.cursos[i].matricular = this.mdiMatricularAlunoIcon
                    this.cursos[i].edit = this.mdiAccountEditIcon
                }
            })
        },
        
        deletarCurso(cursoAserDeletado) {
            linkConection.deletarCurso(cursoAserDeletado).then(cursoDeletado => {
                if(cursoDeletado != {} && cursoDeletado != [] && cursoDeletado != '' && cursoDeletado != undefined && cursoDeletado != null){
                    for(let i = 0; i < this.cursos.length; i++){
                        if(cursoAserDeletado._id === this.cursos[i]._id){
                            this.cursos.splice(i, 1)
                            this.msgCursoDeletado = 'Curso foi deletado com sucesso!'
                            this.alertaCursoDeletado = true

                            return
                        } else {
                            console.log("Curso não encontrado, por gentileza, contate o admin do site para informar o erro!")
                        }
                    }
                }
            })

        },

        openEditCurso(cursoAserEditado) {
            this.caixaDeDialogoParaEditarUmCurso = true
            this.idEdit = cursoAserEditado.id
            this.cursoEdit = cursoAserEditado.curso
            this.mensalidadeEdit = cursoAserEditado.mensalidade
            this.matriculaEdit = cursoAserEditado.matricula
            this.periodoEdit = cursoAserEditado.periodo
            this.tempoEdit = cursoAserEditado.tempo
        },

        editCurso() {
            let cursoEditado = {}
            cursoEditado.id = this.idEdit
            cursoEditado.curso = this.cursoEdit
            cursoEditado.mensalidade = this.mensalidadeEdit
            cursoEditado.matricula = this.matriculaEdit
            cursoEditado.periodo = this.periodoEdit
            cursoEditado.tempo = this.tempoEdit
            cursoEditado.delete = 'mdi-delete'
            cursoEditado.edit = 'mdi-account-edit'
            for(let i = 0; i < this.cursos.length; i++){
                if(this.cursos[i].id === cursoEditado.id){
                    this.cursos.splice(i, 1, cursoEditado)
                }
            }
        }


    },


}
</script>