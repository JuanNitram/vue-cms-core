<template>
    <div>
        <Form :component="'FormSections'"/>
    </div>
</template>

<script>
    import Form from '../../components/forms/Form'
    export default {
        components: {
            Form,
        },
    }
</script>
