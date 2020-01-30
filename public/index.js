const app = new Vue({
    el: '#app',
    data: {
        ingredientes: [],
        pratos: [],
        nome_ingrediente: '',
        preco_por_unidade: null,
        ingredientes_selecionados: [],
        nome_prato: '',
        id_ingrediente: 0,
        quantidade_ingrediente: null,
        pratos_selecionados: [],
        quantidade_pessoas: 0,
        ingredientes_orcamento: [],
        total_orcamento: 0
    },
    watch: {
        quantidade_pessoas() {
            this.calcula_ingredientes_orcamento();
            this.calcula_total_orcamento();
        },
        pratos_selecionados() {
            this.calcula_ingredientes_orcamento();
            this.calcula_total_orcamento();
        }
    },
    methods: {
        calcula_ingredientes_orcamento() {
            const ingredientes = this.pratos
                .filter(el => this.pratos_selecionados.indexOf(el.id) !== -1)
                .map(el => el.ingredientes)
                .flat()
                .reduce((acc, el) => {
                    if (acc[el.id]) acc[el.id].quantidade += el.quantidade;
                    else acc[el.id] = { nome: el.nome, preco_por_unidade: el.preco_por_unidade, quantidade: el.quantidade * this.quantidade_pessoas };
                    return acc;
                }, {});
            this.ingredientes_orcamento = Object.values(ingredientes);
        },
        calcula_total_orcamento() {
            this.total_orcamento = this.ingredientes_orcamento.reduce((acc, el) => acc += el.quantidade * el.preco_por_unidade, 0)
        },
        fetchIngredientes() {
            fetch('/ingrediente').then(res => res.json()).then(json => this.ingredientes = json);
        },
        fetchPratos() {
            fetch('/prato').then(res => res.json()).then(json => {
                this.pratos = Object.values(json.reduce((acc, el) => {
                    acc[el.id] = {
                        id: el.id,
                        nome: el.nome,
                        ...(acc[el.id] || {})
                    };
                    acc[el.id].ingredientes = [
                        ...(acc[el.id].ingredientes || []),
                        {
                            id: el.id_ingrediente,
                            nome: el.nome_ingrediente,
                            quantidade: el.quantidade_ingrediente,
                            preco_por_unidade: el.preco_por_unidade_ingrediente
                        }
                    ]
                    return acc;
                }, {}))
            });
        },

        cadastrarIndrediente() {
            const ingredienteObj = {
                nome: this.nome_ingrediente,
                preco_por_unidade: this.preco_por_unidade
            };
            fetch('/ingrediente', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'post', body: JSON.stringify(ingredienteObj)
            }).then(() => {
                this.fetchIngredientes();
                this.nome_ingrediente = '';
                this.preco_por_unidade = null;
            });
        },

        cadastrarPrato() {
            const pratoObj = {
                nome: this.nome_prato,
                ingredientes: this.ingredientes_selecionados
            };
            fetch('/prato', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'post', body: JSON.stringify(pratoObj)
            }).then(() => {
                this.fetchPratos();
                this.nome_prato = '';
                this.ingredientes_selecionados = [];
            });
        },

        adicionarIngrediente() {
            this.ingredientes_selecionados.push({ id: this.id_ingrediente, nome: this.ingredientes.find((el) => el.id == this.id_ingrediente).nome, quantidade: this.quantidade_ingrediente });
        },
    },
    created: function () {
        this.fetchIngredientes();
        this.fetchPratos();
    }
})