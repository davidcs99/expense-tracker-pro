<template>
  <section class="page-shell">
    <div class="page-shell__header">
      <div>
        <p class="page-shell__eyebrow">Gestión de gastos</p>
        <h1>Registra, filtra y revisa tus movimientos.</h1>
      </div>
      <v-btn color="primary" class="text-none" rounded="pill" @click="openCreateDialog">
        Nuevo gasto
      </v-btn>
    </div>

    <div class="expense-grid">
      <v-alert
        v-if="limitAlertMessage"
        type="warning"
        variant="tonal"
        rounded="xl"
        :text="limitAlertMessage"
      />

      <v-alert
        v-if="errorMessage"
        type="warning"
        variant="tonal"
        rounded="xl"
        :text="errorMessage"
      />

      <v-card class="expense-panel" elevation="0">
        <v-card-text>
          <h2 class="text-h6 font-weight-bold mb-4">Filtros rápidos</h2>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="startDate"
                label="Fecha inicial"
                type="date"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="endDate"
                label="Fecha final"
                type="date"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedCategory"
                :items="categoryOptions"
                label="Categoría"
                variant="outlined"
                hide-details
                clearable
              />
            </v-col>
          </v-row>
          <div class="expense-panel__actions">
            <v-btn color="primary" class="text-none" rounded="pill" @click="applyFilters">
              Aplicar filtros
            </v-btn>
            <v-btn variant="text" class="text-none" @click="reload">Recargar</v-btn>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="expense-panel" elevation="0">
        <v-card-text>
          <h2 class="text-h6 font-weight-bold mb-4">Gastos del usuario</h2>
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            rounded
            class="mb-4"
          />
          <v-table v-else>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in expenses" :key="expense.id">
                <td>{{ formatShortDate(expense.date) }}</td>
                <td>{{ expense.categoryName }}</td>
                <td>{{ expense.description }}</td>
                <td>{{ formatCurrency(expense.amount) }}</td>
                <td>
                  <div class="expense-actions">
                    <v-btn
                      icon="mdi-pencil-outline"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditDialog(expense)"
                    />
                    <v-btn
                      icon="mdi-delete-outline"
                      size="small"
                      variant="text"
                      color="error"
                      :loading="isSaving && expensePendingDeleteId === expense.id"
                      @click="handleDelete(expense.id)"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="!expenses.length">
                <td colspan="5" class="expense-panel__empty">No hay gastos para mostrar.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>

    <expense-form-dialog
      v-model="isDialogOpen"
      :expense="selectedExpense"
      :categories="categories"
      :is-saving="isSaving"
      :error-message="saveErrorMessage"
      @save="handleSave"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ExpenseFormDialog from "@/components/expenses/ExpenseFormDialog.vue";
import { useExpensesData } from "@/composables/useExpensesData";
import type { Expense, ExpensePayload } from "@/types/api";
import { formatCurrency, formatShortDate } from "@/utils/formatters";

const {
  isLoading,
  isSaving,
  errorMessage,
  saveErrorMessage,
  limitAlertMessage,
  categories,
  expenses,
  startDate,
  endDate,
  selectedCategory,
  applyFilters,
  createNewExpense,
  editExpense,
  removeExpense,
  reload,
} = useExpensesData();

const categoryOptions = computed(() => categories.value.map((category) => category.name));
const isDialogOpen = ref(false);
const selectedExpense = ref<Expense | null>(null);
const expensePendingDeleteId = ref<number | null>(null);

const openCreateDialog = () => {
  selectedExpense.value = null;
  isDialogOpen.value = true;
};

const openEditDialog = (expense: Expense) => {
  selectedExpense.value = expense;
  isDialogOpen.value = true;
};

const handleSave = async (payload: ExpensePayload) => {
  try {
    if (selectedExpense.value) {
      await editExpense(selectedExpense.value.id, payload);
    } else {
      await createNewExpense(payload);
    }

    isDialogOpen.value = false;
    selectedExpense.value = null;
  } catch (error) {
    console.error("No se pudo guardar el gasto.", error);
  }
};

const handleDelete = async (expenseId: number) => {
  const confirmed = window.confirm("¿Deseas eliminar este gasto?");

  if (!confirmed) {
    return;
  }

  expensePendingDeleteId.value = expenseId;

  try {
    await removeExpense(expenseId);
  } catch (error) {
    console.error("No se pudo eliminar el gasto.", error);
  } finally {
    expensePendingDeleteId.value = null;
  }
};
</script>

<style scoped>
.page-shell {
  display: grid;
  gap: 1rem;
}

.page-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.page-shell__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
}

.expense-grid {
  display: grid;
  gap: 1rem;
}

.expense-panel {
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}

.expense-panel__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.expense-panel__empty {
  text-align: center;
  color: var(--expense-muted);
  padding: 1rem;
}

.expense-actions {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
</style>
