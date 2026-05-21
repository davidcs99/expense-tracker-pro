<template>
  <section class="page-shell">
    <div>
      <p class="page-shell__eyebrow">Configuración</p>
      <h1>Prepara preferencias y próximos ajustes del sistema.</h1>
    </div>

    <v-card class="settings-card" elevation="0">
      <v-card-text class="pa-8">
        <h2 class="text-h6 font-weight-bold mb-4">Preferencias generales</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-switch label="Recibir alertas al llegar al 80% del límite" color="primary" inset />
          </v-col>
          <v-col cols="12" md="6">
            <v-switch label="Mostrar sugerencias de upgrade" color="primary" inset />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </section>
</template>

<style scoped>
.page-shell {
  display: grid;
  gap: 1rem;
}

.page-shell__eyebrow {
  color: var(--expense-primary-dark);
  font-weight: 700;
}

.settings-card {
  border-radius: 28px;
  border: 1px solid var(--expense-border);
  background: var(--expense-surface);
}
</style>
