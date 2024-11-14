import { db } from './firebase.js';
import { collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
  const passwordModal = document.getElementById('passwordModal');
  const appContainer = document.getElementById('appContainer');
  const submitPasswordBtn = document.getElementById('submitPasswordBtn');
  const passwordInput = document.getElementById('passwordInput');
  const errorMessage = document.getElementById('errorMessage');


  passwordModal.classList.add('show');
  submitPasswordBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    if (password === 'gisho321') {
      passwordModal.classList.remove('show');
      appContainer.style.display = 'block';
    } else {
      errorMessage.style.display = 'block';
    }
  });

  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitPasswordBtn.click();
    }
  });
});

togglePassword.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePassword.textContent = '✖️';
  } else {
    passwordInput.type = 'password';
    togglePassword.textContent = '👁️';
  }
});


async function addNote() {
  const carNumber = document.getElementById('carNumber').value.trim();
  const note = document.getElementById('note').value.trim();

  if (!carNumber || !note) {
    alert('Введите номер машины и заметку.');
    return;
  }

  try {
    await addDoc(collection(db, 'notes'), {
      carNumber,
      note,
      date: new Date().toISOString()
    });
    alert('Заметка сохранена!');
    document.getElementById('carNumber').value = '';
    document.getElementById('note').value = '';
  } catch (error) {
    console.error('Ошибка при сохранении заметки:', error);
  }
}

async function searchNotes() {
  const searchCarNumber = document.getElementById('searchCarNumber').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!searchCarNumber) {
    alert('Введите номер машины для поиска.');
    return;
  }

  try {
    const notesQuery = query(
      collection(db, 'notes'),
      where('carNumber', '==', searchCarNumber)
    );

    const querySnapshot = await getDocs(notesQuery);

    const filteredNotes = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      filteredNotes.push({
        ...data,
        id: doc.id
      });
    });

    filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredNotes.length === 0) {
      resultsDiv.innerHTML = '<p>Заметок не найдено.</p>';
    } else {
      filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.innerHTML = `<p><strong>Дата:</strong> ${new Date(note.date).toLocaleDateString()}</p>
                                 <p><strong>Заметка:</strong> ${note.note}</p>`;
        resultsDiv.appendChild(noteElement);
      });
    }
  } catch (error) {
    console.error('Ошибка при поиске заметок:', error);
  }
}


async function loadHistory() {
  const historyDiv = document.getElementById('history');
  historyDiv.innerHTML = '';

  try {
    const q = query(collection(db, 'notes'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      historyDiv.innerHTML = '<p>История пуста.</p>';
      return;
    }

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');
      historyItem.innerHTML = `<span><strong>Машина:</strong> ${data.carNumber}</span>
                               <span><strong>Дата:</strong> ${new Date(data.date).toLocaleDateString()}</span>
                               <span><strong>Заметка:</strong> ${data.note}</span>`;
      historyDiv.appendChild(historyItem);
    });
  } catch (error) {
    console.error('Ошибка при загрузке истории:', error);
  }
}

document.getElementById('addNoteMenuBtn').addEventListener('click', () => {
  document.getElementById('addNoteSection').style.display = 'block';
  document.getElementById('historySection').style.display = 'none';
  document.getElementById('addNoteMenuBtn').classList.add('active');
  document.getElementById('historyMenuBtn').classList.remove('active');

  document.getElementById('results').innerHTML = '';
});

document.getElementById('historyMenuBtn').addEventListener('click', () => {
  document.getElementById('addNoteSection').style.display = 'none';
  document.getElementById('historySection').style.display = 'block';
  document.getElementById('historyMenuBtn').classList.add('active');
  document.getElementById('addNoteMenuBtn').classList.remove('active');
  loadHistory();
});

document.getElementById('saveNoteBtn').addEventListener('click', addNote);
document.getElementById('searchBtn').addEventListener('click', searchNotes);
