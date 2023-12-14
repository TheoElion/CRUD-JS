// GET LOCALSTORAGE
const getLocalStorage = () => {
    return JSON.parse(localStorage.getItem("db_client")) ?? [];
}

// SET LOCALSTORAGE
const setLocalStorage = (dbClient) => {
    localStorage.setItem("db_client", JSON.stringify(dbClient));
}

// CREATE
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
}

// READ
const readClient = () => getLocalStorage();


// UPDATED
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

// DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('nome').dataset.index = client.index;
    document.getElementById('email').value = client.email;
    document.getElementById('telefone').value = client.telefone;
    document.getElementById('model').value = client.model;
}

const editClient = (index) => {
    const client = readClient()[index];
    client.index = index
    fillFields(client);
    openModal();
}

const editDelete = (e) => {
    if (e.target.type == 'button') {
        const [action, index] = e.target.id.split('-');
        if (action == 'edit') {
            editClient(index);
        } else {
            const response = confirm(`Tem certeza que deseja excluir o pedido?`)
            if (response) {
                deleteClient(index);
                updateTable();
            } 
        }
    }
}

document.querySelector('table>tbody').addEventListener('click', editDelete);

// CHAMAR LINHAS DO DB
const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.telefone}</td>
        <td>${client.model}</td>
        <td>
        <button type="button" class="editButton" id="edit-${index}">Editar</button>
        <button type="button" class="deleteButton" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#table>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#table>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row));
}

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}

updateTable();

// MODAL

// ABRIR E FECHAR MODAL
const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
    document.getElementById('modal').classList.remove('active');
    clearFields();
}

document.getElementById('cadastrarCliente').addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);


// SALVAR INFOS DO MODAL
isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

const salvarClient = () => {
    if(isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            model: document.getElementById('model').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client);
            updateTable();
            closeModal();
        }  else {
            updateClient(index, client);
            updateTable();
            document.getElementById("name").dataset.index = 'new';
            closeModal();
        }
    }
}

document.getElementById('salvar').addEventListener('click', salvarClient);

// lIMPAR OS CAMPOS
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-input');
    fields.forEach(field => field.value = "");
}
