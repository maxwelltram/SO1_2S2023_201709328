#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/sysinfo.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>

static int carnet = 201709328;  // Reemplaza con tu número de carné

static int meminfo_proc_show(struct seq_file *m, void *v) {
    struct sysinfo si;
    si_meminfo(&si);
    long total_mem = si.totalram;
    long free_mem = si.freeram;
    long used_mem = total_mem - free_mem;
    long mem_unit = si.mem_unit;

    seq_printf(m, "Total de RAM: %ld MB\n", total_mem * mem_unit / 1024 / 1024);
    seq_printf(m, "Memoria RAM en uso: %ld MB\n", used_mem * mem_unit / 1024 / 1024);
    seq_printf(m, "Memoria RAM libre: %ld MB\n", free_mem * mem_unit / 1024 / 1024);
    seq_printf(m, "Porcentaje de uso: %ld%%\n", used_mem * 100 / total_mem);

    return 0;
}

static int meminfo_proc_open(struct inode *inode, struct file *file) {
    return single_open(file, meminfo_proc_show, NULL);
}

static const struct file_operations meminfo_proc_fops = {
    .owner      = THIS_MODULE,
    .open       = meminfo_proc_open,
    .read       = seq_read,
    .llseek     = seq_lseek,
    .release    = single_release,
};

int init_module(void) {
    struct task_struct *task;
    struct task_struct *cpu_task = current;  // Tarea actual (la que carga el módulo)

    printk(KERN_INFO "Módulo CPU para carnet: %d\n", carnet);
    printk(KERN_INFO "ID de proceso actual: %d\n", cpu_task->pid);

    // Recorremos la lista de tareas (procesos) del sistema
    for_each_process(task) {
        printk(KERN_INFO "Proceso: %s, PID: %d, Estado: %ld\n", task->comm, task->pid, task->state);
    }

    printk(KERN_INFO "Número de carnet: 201709328\n");
    proc_create("ram_201709328", 0, NULL, &meminfo_proc_fops);

    return 0;
}

void cleanup_module(void) {
    printk(KERN_INFO "Módulo CPU para carnet: %d descargado.\n", carnet);
    printk(KERN_INFO "Nombre del estudiante: Maxwellt Ramírez\n");
    remove_proc_entry("ram_201709328", NULL);
}

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Maxwellt Ramírez");
MODULE_DESCRIPTION("Módulo para Tarea 4");
