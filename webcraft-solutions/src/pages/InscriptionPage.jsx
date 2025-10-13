import Hero from "../components/Hero.jsx";
import { useEffect, useMemo, useState } from "react";
import useFetch from "../hooks/UseFetch.jsx";
import { validators } from "../utils/validation.js";

const API_COURSES = "https://webcraft-api.vercel.app/data/courses.json";

export default function InscriptionPage() {
  const { data } = useFetch(API_COURSES);
  const courses = data?.courses ?? [];

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    course: "",
    level: "",
    motivation: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const levels = useMemo(() => ["Débutant", "Intermédiaire", "Avancé"], []);

  function validateField(name, value) {
    const rule = validators[name];
    if (!rule) return "";
    const res = rule(value);
    return res === true ? "" : res;
  }

  function onChange(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const newErrors = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, validateField(k, v)])
    );
    setErrors(newErrors);
    const ok = Object.values(newErrors).every((msg) => !msg);
    if (!ok) return;

    setSending(true);
    setSuccess(false);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        course: "",
        level: "",
        motivation: "",
      });
    }, 800);
  }

  useEffect(() => {
    setSuccess(false);
  }, [form.course]);

  return (
    <main>
      <Hero
        small
        title='Inscription'
        subtitle='Remplissez le formulaire pour vous inscrire à une formation.'
      />

      <section className='section'>
        <div className='container'>
          <form className='card form' onSubmit={onSubmit} noValidate>
            <div className='form__row'>
              <div className='field'>
                <label htmlFor='firstname'>Prénom</label>
                <input
                  id='firstname'
                  value={form.firstname}
                  onChange={(e) => onChange("firstname", e.target.value)}
                  minLength={2}
                  required
                />
                <p className='error' aria-live='polite'>
                  {errors.firstname}
                </p>
              </div>
              <div className='field'>
                <label htmlFor='lastname'>Nom</label>
                <input
                  id='lastname'
                  value={form.lastname}
                  onChange={(e) => onChange("lastname", e.target.value)}
                  minLength={2}
                  required
                />
                <p className='error' aria-live='polite'>
                  {errors.lastname}
                </p>
              </div>
            </div>

            <div className='form__row'>
              <div className='field'>
                <label htmlFor='email'>Email</label>
                <input
                  id='email'
                  type='email'
                  placeholder='vous@exemple.com'
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  required
                />
                <p className='error' aria-live='polite'>
                  {errors.email}
                </p>
              </div>
              <div className='field'>
                <label htmlFor='phone'>Téléphone</label>
                <input
                  id='phone'
                  type='tel'
                  placeholder='+33 6 12 34 56 78'
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  required
                />
                <p className='error' aria-live='polite'>
                  {errors.phone}
                </p>
              </div>
            </div>

            <div className='form__row'>
              <div className='field'>
                <label htmlFor='course'>Formation</label>
                <select
                  id='course'
                  value={form.course}
                  onChange={(e) => onChange("course", e.target.value)}
                  required>
                  <option value=''>Sélectionnez une formation</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <p className='error' aria-live='polite'>
                  {errors.course}
                </p>
              </div>
              <div className='field'>
                <label htmlFor='level'>Niveau</label>
                <select
                  id='level'
                  value={form.level}
                  onChange={(e) => onChange("level", e.target.value)}
                  required>
                  <option value=''>Débutant / Intermédiaire / Avancé</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <p className='error' aria-live='polite'>
                  {errors.level}
                </p>
              </div>
            </div>

            <div className='field'>
              <label htmlFor='motivation'>Motivation</label>
              <textarea
                id='motivation'
                rows='5'
                placeholder='Au moins 50 caractères…'
                value={form.motivation}
                onChange={(e) => onChange("motivation", e.target.value)}
                required
              />
              <p className='error' aria-live='polite'>
                {errors.motivation}
              </p>
            </div>

            <div className='form__actions'>
              <button type='submit' className='btn btn--primary' aria-busy={sending || undefined}>
                {sending ? "Envoi…" : "Envoyer"}
              </button>
              <button
                type='reset'
                className='btn'
                onClick={() => {
                  setForm({
                    firstname: "",
                    lastname: "",
                    email: "",
                    phone: "",
                    course: "",
                    level: "",
                    motivation: "",
                  });
                  setErrors({});
                  setSuccess(false);
                }}>
                Réinitialiser
              </button>
            </div>

            {success && <p className='success'>Inscription envoyée avec succès. Merci !</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
