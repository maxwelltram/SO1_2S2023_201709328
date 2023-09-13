#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>

static int carnet = 12345;  // Reemplaza con tu número de carné

int init_module(void) {
    struct task_struct *task;
    struct task_struct *cpu_task = current;  // Tarea actual (la que carga el módulo)

    printk(KERN_INFO "Módulo CPU para carnet: %d\n", carnet);
    printk(KERN_INFO "ID de proceso actual: %d\n", cpu_task->pid);

    // Recorremos la lista de tareas (procesos) del sistema
    for_each_process(task) {
        printk(KERN_INFO "Proceso: %s, PID: %d, Estado: %ld\n", task->comm, task->pid, task->state);
    }

    return 0;
}

void cleanup_module(void) {
    printk(KERN_INFO "Módulo CPU para carnet: %d descargado.\n", carnet);
}
