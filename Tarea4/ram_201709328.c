#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/sysinfo.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>


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

static int __init ram_module_init(void) {
    printk(KERN_INFO "Número de carnet: 201709328\n");
    proc_create("ram_201709328", 0, NULL, &meminfo_proc_ops);
    return 0;
}

static void __exit ram_module_exit(void) {
    printk(KERN_INFO "Nombre del estudiante: Maxwellt Ramírez\n");
    remove_proc_entry("ram_201709328", NULL);
}

module_init(ram_module_init);
module_exit(ram_module_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Maxwellt Ramírez");
MODULE_DESCRIPTION("Módulo para Tarea 4");
