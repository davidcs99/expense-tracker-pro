<template>
  <v-dialog v-model="internalOpen" max-width="640">
    <v-card class="expense-dialog" rounded="xl">
      <v-card-title class="text-h6 font-weight-bold">
        {{ expense ? "Editar gasto" : "Nuevo gasto" }}
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="displayErrorMessage"
          type="warning"
          variant="tonal"
          rounded="lg"
          class="mb-4"
          :text="displayErrorMessage"
        />

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.categoryId"
              :items="categoryOptions"
              item-title="label"
              item-value="value"
              label="Categoría"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.amount"
              label="Monto"
              type="number"
              min="0"
              step="0.01"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.date"
              label="Fecha"
              type="date"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Descripción"
              variant="outlined"
              rows="3"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" class="text-none" rounded="pill" :loading="isSaving" @click="submitForm">
          {{ expense ? "Guardar cambios" : "Crear gasto" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { Category, Expense, ExpensePayload } from "@/types/api";

type FormState = {
  categoryId: number | null;
  amount: string;
  date: string;
  description: string;
};

const props = defineProps<{
  modelValue: boolean;
  expense?: Expense | null;
  categories: Category[];
  isSaving: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "save", payload: ExpensePayload): void;
}>();

const form = reactive<FormState>({
  categoryId: null,
  amount: "",
  date: "",
  description: "",
});
const validationMessage = ref("");

const internalOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const categoryOptions = computed(() =>
  props.categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))
);

const displayErrorMessage = computed(() => validationMessage.value || props.errorMessage);

const resetForm = () => {
  form.categoryId = props.expense?.categoryId ?? null;
  form.amount = props.expense?.amount ? String(props.expense.amount) : "";
  form.date = props.expense?.date ? String(props.expense.date).slice(0, 10) : "";
  form.description = props.expense?.description ?? "";
  validationMessage.value = "";
};

watch(
  () => [props.modelValue, props.expense],
  () => {
    if (props.modelValue) {
      resetForm();
    }
  },
  { immediate: true }
);

const closeDialog = () => {
  emit("update:modelValue", false);
};

const submitForm = () => {
  if (!form.categoryId || Number(form.amount) <= 0 || !form.date) {
    validationMessage.value = "Completa categoría, monto válido y fecha para continuar.";
    return;
  }

  if (new Date(form.date) > new Date()) {
    validationMessage.value = "La fecha del gasto no puede estar en el futuro.";
    return;
  }

  validationMessage.value = "";

  emit("save", {
    categoryId: form.categoryId,
    amount: Number(form.amount),
    date: form.date,
    description: form.description.trim(),
  });
};
</script>

<style scoped>
.expense-dialog {
  border: 1px solid var(--expense-border);
  background: var(--expense-surface-strong);
}
</style>
