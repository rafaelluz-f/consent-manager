import React from 'react'
import cookies from 'js-cookie'
import { Pane, Heading, Button } from 'evergreen-ui'
import { ConsentManager, openConsentManager, loadPreferences, onPreferencesSaved } from '../src'
import { storiesOf } from '@storybook/react'
import { CloseBehaviorFunction } from '../src/consent-manager/container'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { CloseBehavior, Preferences, CustomCategories } from '../src/types'
import CookieView from './components/CookieView'

const customCategories = {
  'Do Not Sell': {
    integrations: ['AdWords'],
    purpose: 'To give the right to opt out of the sale of personal data.'
  }
}

const bannerContent = (
  <span>
    We use cookies (and other similar technologies) to collect data to improve your experience on
    our site. By using our website, you’re agreeing to the collection of data as described in our{' '}
    <a
      href="https://segment.com/docs/legal/website-data-collection-policy/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Website Data Collection Policy
    </a>
    .
  </span>
)
const bannerSubContent = 'You can manage your preferences here!'
const preferencesDialogTitle = 'Website Data Collection Preferences'
const preferencesDialogContent = (
  <div>
    <p>
      Segment uses data collected by cookies and JavaScript libraries to improve your browsing
      experience, analyze site traffic, deliver personalized advertisements, and increase the
      overall performance of our site.
    </p>
    <p>
      By using our website, you’re agreeing to our{' '}
      <a
        href="https://segment.com/docs/legal/website-data-collection-policy/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Website Data Collection Policy
      </a>
      .
    </p>
    <p>
      The table below outlines how we use this data by category. To opt out of a category of data
      collection, select “No” and save your preferences.
    </p>
  </div>
)
const cancelDialogTitle = 'Are you sure you want to cancel?'
const cancelDialogContent = (
  <div>
    Your preferences have not been saved. By continuing to use our website, you’re agreeing to our{' '}
    <a
      href="https://segment.com/docs/legal/website-data-collection-policy/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Website Data Collection Policy
    </a>
    .
  </div>
)

const ConsentManagerExample = (props: {
  closeBehavior: CloseBehavior | CloseBehaviorFunction
  customCategories: CustomCategories
}) => {
  const [prefs, updatePrefs] = React.useState<Preferences>(loadPreferences())

  const cleanup = onPreferencesSaved(preferences => {
    updatePrefs(preferences)
  })

  React.useEffect(() => {
    return () => {
      cleanup()
    }
  })

  return (
    <Pane>
      <ConsentManager
        writeKey="tYQQPcY78Hc3T1hXUYk0n4xcbEHnN7r0"
        otherWriteKeys={['vMRS7xbsjH97Bb2PeKbEKvYDvgMm5T3l']}
        bannerContent={bannerContent}
        bannerSubContent={bannerSubContent}
        preferencesDialogTitle={preferencesDialogTitle}
        preferencesDialogContent={preferencesDialogContent}
        cancelDialogTitle={cancelDialogTitle}
        cancelDialogContent={cancelDialogContent}
        closeBehavior={props.closeBehavior}
        customCategories={props.customCategories}
      />

      <Pane marginX={100} marginTop={20}>
        <Heading> Cute Cats </Heading>
        <Pane display="flex">
          <iframe
            src="https://giphy.com/embed/JIX9t2j0ZTN9S"
            width="480"
            height="480"
            frameBorder="0"
          />

          <iframe
            src="https://giphy.com/embed/yFQ0ywscgobJK"
            width="398"
            height="480"
            frameBorder="0"
          />
        </Pane>

        <p>
          <div>
            <Heading>Current Preferences</Heading>
            <SyntaxHighlighter language="json" style={docco}>
              {JSON.stringify(prefs, null, 2)}
            </SyntaxHighlighter>
          </div>
          <Button marginRight={20} onClick={openConsentManager}>
            Change Cookie Preferences
          </Button>
          <Button
            onClick={() => {
              cookies.remove('tracking-preferences')
              window.location.reload()
            }}
          >
            Clear
          </Button>
        </p>
      </Pane>
      <CookieView />
    </Pane>
  )
}

storiesOf('Custom Categories - Do Not Sell', module)
  .add(`Dismiss`, () => (
    <ConsentManagerExample closeBehavior={'dismiss'} customCategories={customCategories} />
  ))
  .add(`Accept`, () => (
    <ConsentManagerExample closeBehavior={'accept'} customCategories={customCategories} />
  ))
  .add(`Deny`, () => (
    <ConsentManagerExample closeBehavior={'deny'} customCategories={customCategories} />
  ))
  .add(`Custom Close Behavior`, () => (
    <ConsentManagerExample
      closeBehavior={categories => ({
        ...categories,
        'Do Not Sell': false
      })}
      customCategories={customCategories}
    />
  ))
  .add(`Essential`, () => (
    <ConsentManagerExample
      closeBehavior={'dismiss'}
      customCategories={{
        'Do Not Sell': {
          integrations: ['AdWords'],
          purpose: 'To give the right to opt out of the sale of personal data.'
        },
        Essential: {
          integrations: ['Amplitude'],
          purpose: 'To give the right to opt out of the sale of personal data.'
        }
      }}
    />
  ))
