// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ ABRIR E FECHAR CAIXA MODAL ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const Modal = {
  open() {
    // Abrir modal
    // Adicionar classe "active" no modal do HTML
    document.querySelector('.modal_transparent').classList.add('active')
  },
  close() {
    // Fechar modal
    // Remover classe "active" no modal do HTML
    document.querySelector('.modal_transparent').classList.remove('active')
  }

}

// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ PEGAR "GET" E GUARDAR "SET" AS INFORMAÇÕES DIGITADAS ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const Storage = {
  get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  }, // Transformar de volta do SET a string para array

  set(transactions) { // Sempre irá guardar dado como string
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  } // "JSON.stringify" = Transformar array para string
}

// XXXXXXXXX DESCRIÇÃO DOS DADOS (NÃO PRECISA MAIS APÓS USAR "STORAGE") XXXXXXXXXX
/* const Dados_Transactions = [
  {
    
    //id: 1,
    description: 'Luz',
    money: -50000,
    date: '17/10/2021'
  },
  {
    //id: 2,
    description: 'Criação Website',
    money: 700000,
    date: '17/10/2021'
  },
  {
    //id: 3,
    description: 'Internet',
    money: -200000,
    date: '17/10/2021'
  },
  {
    //id: 4,
    description: 'Criação Banco de Dados',
    money: 100000,
    date: '17/10/2021'
  }
]  */

// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ CÁLCULO DOS DADOS ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  money_receive() {
    let income = 0
    // Forma anterior a refatoração: Dados_Transactions.forEach
    Transaction.all.forEach(function (transaction) {
      if (transaction.money > 0) {
        // somar à uma variável e retornar a variável
        income = income + transaction.money
      }
    })
    return income
  },
  money_spent() {
    let expense = 0
    Transaction.all.forEach(function (transaction) {
      if (transaction.money < 0) {
        // somar à uma variável e retornar a variável
        expense = expense + transaction.money
      }
    })
    return expense
  },
  total() {
    return (total = Transaction.money_receive() + Transaction.money_spent())
  }
}
// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ CHAMAR DADOS HTML ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const DOM = {
  // transactions_container = contém luz, website e internet
  transactions_container: document.querySelector('#table tbody'),

  add_Transaction(transaction, index) { // index = posição do array guardada
    const tr = document.createElement('tr') // Criar o "tr"
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) // "tr" criado recebe dados do innerHTML
    tr.dataset.index = index

    DOM.transactions_container.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const CSS_Class = transaction.money > 0 ? 'money_receive' : 'money_spent' // Se dinheiro for maior que 0 = dinheiro recebido; senão = dinheiro gasto

    const money = utility.format_currency(transaction.money)

    const HTML = `
    <td class="description">${transaction.description}</td>
    <td class="${CSS_Class}">${money}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img onclick="Transaction.remove(${index})" src="/assets/minus.svg" alt="Sinal subtração" />
    </td>
    `

    return HTML // Retorna função HTML para poder utilizar no "const DOM"
  },

  update_balance() {
    document.getElementById('money_receive_display').innerHTML =
      utility.format_currency(Transaction.money_receive())
    document.getElementById('money_spent_display').innerHTML =
      utility.format_currency(Transaction.money_spent())
    document.getElementById('total_display').innerHTML =
      utility.format_currency(Transaction.total())
  },

  clear_transactions() {
    // limpar a caixa de transação ao adicionar novo dado
    DOM.transactions_container.innerHTML = ''
    // O conteúdo das transações (dentro da tbody) recebe vazio >>> "".
  }
}
// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ CONVERTER DINHEIRO & COLOCAR VÍRGULA NO R$ ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const utility = {
  format_money(value) {
    value = Number(value) * 100

    return value
  }, // Formatar, pois valores do formulário chegam como string

  format_date(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  format_currency(value) {
    const signal = Number(value) < 0 ? '' : '+'

    value = String(value).replace(/ \D /g, 'miojo')
    // O "/ \D \g" substitui tudo que NÃO for número. O "g" é para pegar global
    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency', // Aparentemente precisa utilizar o termo "currency"
      currency: 'BRL'
    })

    return signal + value
  }
}
// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ FORMULÁRIO ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const Form = {
  // Pegar input que tem o ID 'description' \/
  description: document.querySelector('input#description'),
  money: document.querySelector('input#money'),
  date: document.querySelector('input#date'),

  // Pegar só os valores e deixar guardado na função getvalues
  get_values() {
    return {
      description: Form.description.value,
      money: Form.money.value,
      date: Form.date.value
    }
  },

  validate_fields() {
    const { description, money, date } = Form.get_values()

    if (
      description.trim() === '' ||
      money.trim() === '' ||
      date.trim() === ''
    ) {
      // Se tudo estiver vazio = Erro
      throw new Error('Por favor, preencha o(s) campo(s) vazio(s)')
    }
  },

  format_values() {
    let { description, money, date } = Form.get_values()
    money = utility.format_money(money)

    date = utility.format_date(date)

    return {
      description,
      money,
      date
    }
  },

  clear_fields() {
    Form.description.value = ""
    Form.money.value = ""
    Form.date.value = ""
},
  submit(event) {
    event.preventDefault() // analisar: função ou nome de variável?

    try {
      Form.validate_fields()
      const transaction = Form.format_values()
      Transaction.add(transaction)
      Form.clear_fields()
      Modal.close()
    } catch (error) {
      alert(error.message)
    }

    // verificar se informações foram preenchidas = form não vazio
    Form.validate_fields()
    // formatar os dados para salvar
    Form.format_values()
    // salvar
    // zerar formulário para add novo cadastro
    // fechar o modal
    // atualizar o APP
  }
}

// ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘ INICIO E RELOAD P/ LIMPAR TELA AO ADD/REMOVER ALGO ◘◘◘◘◘◘◘◘◘◘◘◘◘◘◘
const App = {
  // "DOM.add_Transaction(Dados_Transactions[0])" Jogaria 1º dado para a const DOM. No caso "luz"
  // Igual a for (i = 0; i < transaction.lenght; i++)

  iniciar() {
    Transaction.all.forEach(DOM.add_Transaction)
        
        DOM.update_balance()

        Storage.set(Transaction.all)
  },
  reload() {
    DOM.clear_transactions()
    App.iniciar()
  }
}

App.iniciar()
