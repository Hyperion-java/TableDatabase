document.addEventListener("DOMContentLoaded", () => {
  const dataTable = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
  const formModal = document.getElementById("formModal");
  const dataForm = document.getElementById("dataForm");
  const addRowBtn = document.getElementById("addRowBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  
  let currentRowId = null;

  // Fetch and display data
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    dataTable.innerHTML = ''; // Clear existing rows
    data.forEach(row => {
      const rowElement = document.createElement('tr');
      rowElement.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.version}</td>
        <td>${row.description}</td>
        <td>${row.file || "No file"}</td>
        <td>
          <button class="icon-btn" onclick="replaceRow('${row.id}')" data-tooltip="Replace File"><i class="fas fa-sync-alt"></i></button>
          <button class="icon-btn" onclick="deleteRow('${row.id}')" data-tooltip="Delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
      dataTable.appendChild(rowElement);
    });
  };

  // Show form modal
  const showForm = (row = null) => {
    formModal.style.display = "flex";
    if (row) {
      document.getElementById("name").value = row.name;
      document.getElementById("version").value = row.version;
      document.getElementById("description").value = row.description;
      currentRowId = row.id;
    } else {
      document.getElementById("name").value = '';
      document.getElementById("version").value = '';
      document.getElementById("description").value = '';
      currentRowId = null;
    }
  };

  // Hide form modal
  cancelBtn.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  // Add or update row
  dataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(dataForm);
    const method = currentRowId ? 'PUT' : 'POST';
    const url = currentRowId ? `/api/data/${currentRowId}` : '/api/data';
    
    const response = await fetch(url, {
      method: method,
      body: formData
    });

    if (response.ok) {
      formModal.style.display = "none";
      fetchData(); // Refresh the table
    }
  });

  // Replace row (Replace file functionality)
  window.replaceRow = async (id) => {
    const response = await fetch(`/api/data/${id}`);
    const row = await response.json();
    showForm(row);
  };

  // Delete row
  window.deleteRow = async (id) => {
    if (confirm('Are you sure?')) {
      const response = await fetch(`/api/data/${id}`, { method: 'DELETE' });
      if (response.ok) fetchData();
    }
  };

  // Initialize data on page load
  fetchData();
  
  // Show form for adding new row
  addRowBtn.addEventListener("click", () => {
    showForm();
  });
});
